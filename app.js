/*##############################################################################
_     _  _____  ______  _______                         
| |   | |/ ___ \|  ___ \(_______)                        
| |__ | | |   | | | _ | |_____   ____   ____  ____  ____ 
|  __)| | |   | | || || |  ___) |  _ \ / _  |/ _  |/ _  )
| |   | | |___| | || || | |_____| | | ( ( | ( ( | ( (/ / 
|_|   |_|\_____/|_||_||_|_______) ||_/ \_||_|\_|| |\____)
                                |_|         (_____| 
 Participants:
 Description:

 ##############################################################################*/

var express          = require('express');
var session          = require('express-session');
var FileStore        = require('session-file-store')(session);
var path             = require('path');
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var passport         = require('passport');
var methodOverride   = require('method-override');
var dbcon            = require('./knexfile');
var flash            = require('connect-flash');
const objection      = require('objection');
var multer           = require('multer');
var fs               = require("fs");
let expressSanitized = require('express-sanitize-escape');
let back             = require('express-back');
let helmet           = require('helmet')

const Model = objection.Model;
const Knex  = require('knex');
const knex  = Knex(dbcon.production);
// Give the connection to objection.
Model.knex(knex);


require('./config/passport')(passport);
const User      = require('./models/User');
var index       = require('./routes/index');
var about       = require('./routes/about');
var user        = require('./routes/user');
var search      = require('./routes/search');
var messaging   = require('./routes/messaging');
var real_estate = require('./routes/real_estate');
var rateable    = require('./routes/rateable');
var favorable   = require('./routes/favorable');

var appointments = require('./routes/appointments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// true or false ?
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(expressSanitized.middleware());
//File Upload
app.use(multer({dest: 'public/images/houses/tmp/'}).any());

var passport = require('passport');

//all what is needed for session handling 
var expressSession = require('express-session');
app.use(expressSession(
    {
        secret           : 'thisShouldBeSomethingOnlyKnownToUs',
        cookie           : {maxAge: 1000 * 60 * 60}, // time in ms so 1000*60*60 = 1 hour
        name             : 'HOMEpage.sid', // set custom name to identify our cookie
        resave           : false,
        saveUninitialized: false,
        store            : new FileStore,
        //No automatic logout
        rolling          : true
    }
));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(back({default: '/fa17g16'}));

//----------------------------------------------------------------------------------------------

app.use('/fa17g16/public', express.static(path.join(__dirname, 'public')));

//append request and session to use directly in views and avoid passing around needless stuff
var appendLocalsToUseInViews = function (req, res, next)
{
    res.locals.request = req;
    if (req.session.passport != null && req.session.passport.user != null)
    {
        res.locals.user = req.session.passport.user[0];
        User.query()
            .findById(res.locals.user.id)
            .eager('[roles,family,agency,adress]')
            .omit(['salt'])
            .then(user =>
                  {
                      res.locals.userdata     = user;
                      res.locals.user.isAdmin = 0;
                      user.roles.forEach(function (entry)
                                         {
                                             if (entry.name === 'admin')
                                                 res.locals.user.isAdmin = 1;
                                         });
                  })
            .catch(err =>
                   {
                       console.error(err);
                   });
    }
    next(null, req, res);
};
app.use(appendLocalsToUseInViews);
// add flash messages
app.use(function (req, res, next)
        {
            res.locals.sessionFlash =
                {
                    info : req.flash('info'),
                    error: req.flash('error')
                };
            next();
        });
app.use(helmet());
//----------------------------------------------------------------------------------------------


app.use('/fa17g16/', index);
app.use('/fa17g16/user', user);
app.use('/fa17g16/about', about);
app.use('/fa17g16/search', search);
app.use('/fa17g16/messaging', messaging);
app.use('/fa17g16/real_estate', real_estate);
app.use('/fa17g16/rateable', rateable);
app.use('/fa17g16/favoriten', favorable);
app.use('/fa17g16/appointments', appointments);

// catch 404 and forward to error handler
app.use(function (req, res, next)
        {
            var err    = new Error('Not Found');
            err.status = 404;
            res.render('partials/error', {
                title: 'Invalid Route'
            });
            //next(err);
            //if some route is not available fallback to start
            //res.redirect('/fa17g16/');
        });

// error handler
app.use(function (err, req, res, next)
        {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error   = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
/*
 possible 500 / 404 handling
 app.use(function(err, req, res, next){
 // log it
 if (!module.parent) console.error(err.stack);

 // error page
 res.status(500).render('5xx');
 });

 // assume 404 since no middleware responded
 app.use(function(req, res, next){
 res.status(404).render('404', { url: req.originalUrl });
 });
 */
module.exports = app;
