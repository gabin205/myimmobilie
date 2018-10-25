/*##############################################################################
 _     _  _____  ______  _______
 | |   | |/ ___ \|  ___ \(_______)
 | |__ | | |   | | | _ | |_____   ____   ____  ____  ____
 |  __)| | |   | | || || |  ___) |  _ \ / _  |/ _  |/ _  )
 | |   | | |___| | || || | |_____| | | ( ( | ( ( | ( (/ /
 |_|   |_|\_____/|_||_||_|_______) ||_/ \_||_|\_|| |\____)
 |_|         (_____|
 Participants: Tim, Micha
 Description:
 This file contains functions and API interfaces that are needed in context of
 the user management functionality.

 API interfaces:
 ---------------
 /user/ => Redirect to user specific Dashboard
 /user/dashboard => Render Dashboard for specific user and uses function
 getAllUserData
 /user/reg => regestration with DB logic located in /config/passport.js
 /user/login => login with DB logic located in /config/passport.js
 /user/logout => logout
 /user/edit => edit user fields and families
 /user/edit/details => store a users information (phone / mobile / name / etc.)
 /user/edit/credentials => set new login credentials for user
 /user/:userID => view a specific user profile
 /edit/family/add => add a new family member
 /edit/family/delete => remove a family member
 /edit/family/trigger/public/:famID => trigger a families usePublicTransport setting (on/off)

 functions:
 ----------
 getUserRoles => DB logic that queries users assigened roles
 getBuyerdata => DB logic that queries users data associated with role buyer
 getSellerdata => DB logic that queries users data associated with role seller
 getAgentdata => DB logic that queries users data associated with role agent
 getAdmindata => DB logic that queries users data associated with role admin
 getUserData => DB logic that queries users data for editing
 renderuserEdit => Rendering Logic for User Edit
 redirectToEditPage
 register => DB/passport logic that queries a users registration
 login => DB/passport logic that queries a users login
 logout => DB/passport logic that queries a users logout
 storeUserData => DB logic that queries
 sha512 => Function to encrypt password
 storeUserCredentials =>
 handleNewFamilyMember =>
 handleRemoveFamilyMember =>
 handleAdress =>
 handlePublicTransportTrigger =>
 ##############################################################################*/
var path         = require('path');
var fs           = require("fs");
var randomstring = require("randomstring");
const crypto     = require('crypto');
let express      = require('express');
const router     = express.Router();
const knexfile   = require('../knexfile');//db config
const objection  = require('objection');
const Model      = objection.Model;
const Knex       = require('knex'); // db layer
const knex       = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const passport = require('passport');
const User     = require('../models/User');
const Adress   = require('../models/Adress');
const Zipcode  = require('../models/Zipcode');
const Family   = require('../models/User_Families');

// queries the roles that a spefic user has assigened to himself
function getUserRoles(req, res, next)
{
    if (req.isAuthenticated())
    {
        // Query based on Model User with relation roles
        User.query()
            .where('id', res.locals.user.id)
            .eager('roles')
            .then(userdata =>
                  {
                      req.user_roles = userdata[0].roles;
                      return next();
                  })
            .catch(err =>
                   {
                       req.flash('error', err);
                       return next(err);
                   });
    }
    else
    {
        return next();
    }
}

// queries all buyer specific information
function getBuyerdata(req, res, next)
{
    if (req.isAuthenticated())
    {
        if (req.user_roles[0] && req.user_roles[0].id === 1)
        {
            // Query based on Model User with buyer specific relations
            return User.query()
                       .where('id', res.locals.user.id)
                       .eager(
                           '[adress.zipcode, conversations.[participants.[agent_ratings], message.[real_estate, answers.^]], searches,family ]')
                       .then(buyerdataresult =>
                             {
                                 req.buyerdata = buyerdataresult[0];
                                 return next();
                             })
                       .catch(err =>
                              {
                                  return next(err);
                              });
        }
        else
        {
            req.buyerdata = null;
            return next();
        }
    }
    else
    {
        return next();
    }
}

// queries all buyer specific information
function getSellerdata(req, res, next)
{
    if (req.isAuthenticated())
    {
        if (req.user_roles[1] && req.user_roles[1].id === 2)
        {
            console.log('User is seller');
            // Query based on Model User with seller specific relations
            User.query()
                .where('id', res.locals.user.id)
                .eager('[real_estate.[adress.zipcode, seller], advertisements]')
                .then(sellerdataresult =>
                      {
                          req.sellerdata = sellerdataresult[0];
                          return next();
                      })
                .catch(err =>
                       {
                           return next(err);
                       });
        }
        else
        {
            req.sellerdata = null;
            next();
        }
    }
    else
    {
        next();
    }
}

// queries all buyer specific information
function getAgentdata(req, res, next)
{
    if (req.isAuthenticated())
    {
        if (req.user_roles[2] && req.user_roles[2].id === 3)
        {
            console.log('User is agent');
            // Query based on Model User with agent specific relations
            User.query()
                .where('id', res.locals.user.id)
                .eager('[agency, selling_real_estate.[adress.zipcode, owner,medias] ]')
                .then(agentdataresult =>
                      {
                          console.log(agentdataresult);
                          req.agentdata = agentdataresult[0];
                          return next();
                      })
                .catch(err =>
                       {
                           req.flash('error', err);
                           return next();
                       });
        }
        else
        {
            req.agentdata = null;
            next();
        }
    }
    else
    {
        next();
    }
}

// queries all buyer specific information
function getAdmindata(req, res, next)
{
    if (req.isAuthenticated())
    {
        if (req.user_roles[3] && req.user_roles[3].id === 4)
        {
            console.log('User is admin');
            // Query based on Model User with admin specific relations
            User.query()
                .where('id', res.locals.user.id)
                .eager()
                .then(admindataresult =>
                      {
                          req.admindata = admindataresult[0];
                          return next();
                      })
                .catch(err =>
                       {
                           req.flash('error', err);
                           return next();
                       });
        }
        else
        {
            req.admindata = null;
            next();
        }
    }
    else
    {
        next();
    }
}

// queries all user specific information
function getUserData(req, res, next)
{
    if (parseInt(req.params.userID) > 0)
    {
        User.query().findById(parseInt(req.params.userID))
            .eager('[roles,agent_ratings.user,adress.zipcode,selling_real_estate.[medias,adress.zipcode]]')
            .then(data =>
                  {
                      req.data = {render: 'view', user: data};
                      return next();
                  })
            .catch(err =>
                   {
                       req.flash('error', err);
                       return next(err);
                   });
    }
    else if (req.isAuthenticated())
    {
        User.query().findById(res.locals.user.id)
            .eager(
                '[agent_ratings,favorite_agent,favorite_real_estate,advertisements,roles.permissions,real_estate,family,conversations,searches,favorite_agent,favorite_real_estate,user_ratings,agency,adress.zipcode]')
            .then(data =>
                  {
                      req.data = {render: 'edit', user: data};
                      return next();
                  })
            .catch(err =>
                   {
                       req.flash('error', err);
                       return next(err);
                   });
    } else
    {
        next();
    }
}

function renderUserEdit(req, res, next)
{
    if (req.hasOwnProperty('data'))
    {
        switch (req.data.render)
        {
            case 'view':
                //req.flash('info', 'user loaded');
                res.render('user/view', {
                    data : {
                        user: req.data.user
                    },
                    title: 'View User'
                });
                break;
            case 'edit':
                res.render('user/edit', {
                    data : {
                        user: req.data.user
                    },
                    title: 'Edit User'
                });
                break;
            default:
                req.flash('error', 'invalid render function');
                res.redirect('/fa17g16/');
        }
    }

}

function redirectToEditPage(req, res, next)
{
    res.redirect('/fa17g16/user/edit');
}

function register(req, res, next)
{
    passport.authenticate('local-signup', function (err, user, info)
    {
        if (err)
        {
            return next(err);
        }
        if (!user)
        {
            return res.redirect('/fa17g16');
        }
        req.logIn(user, function (err)
        {
            if (err)
            {
                //If Login was not succesful
                req.flash('error', err);
                return next(err);
            }
            //If Login was succesful
            return res.redirect('/fa17g16/user');
        });
    })(req, res, next);
}

function login(req, res, next)
{
    passport.authenticate('local-login', function (err, user, info)
    {
        if (err)
        {
            return next(err);
        }
        //if login failed the user will be null
        if (!user)
        {
            //response with status of login and a message (from passport local-login)
            return res.json({login: 'false', message: '' + info.message + ''});
        }
        req.logIn(user, function (err)
        {
            if (err)
            {
                //Error in Login
                return next(err);
            }
            console.log("user_id", user[0].id);
            //response with status of login and a message (from passport local-login)
            return res.json({login: 'true', message: '' + info.message + '', user_id: user[0].id});
        });
    })(req, res, next);
}

function storeUserData(req, res, next)
{
    console.log(req.body.usePublicTransport);
    // extract handled information
    let data = {
        first_name        : req.body.first_name,
        last_name         : req.body.last_name,
        email             : req.body.email,
        phone             : req.body.phone,
        mobile            : req.body.mobile,
        usePublicTransport: req.body.usePublicTransport !== undefined ? 1 : 0
    };
    //filter empty fields
    for (let key in data)
    {
        // skip loop if the property is from prototype
        if (!data.hasOwnProperty(key)) continue;
        //check length
        if (data[key].length <= 0)
            delete data[key];
    }
    // update user (using patch so only present fields are validated)
    User
        .query()
        .patchAndFetchById(res.locals.user.id, data)
        .then(user =>
              {
                  req.flash('info', 'New Information successfully saved');
                  return next();
              })
        .catch(err =>
               {
                   req.flash('error', err);
                   res.redirect('/fa17g16/user/edit');
               });
}

function storeProfilepicture(req, res, next)
{
    //console.log(req.files);
    var pubhtmlpath = path.join(__dirname, '..', '..', '..', '..', 'var', 'www', 'html', 'public', 'images', 'users');

    // Write the images out of req into public html
    req.files.forEach(function (file)
                      {
                          //generate randomString for unique file name
                          var filename              = randomstring.generate();
                          var originalfilenameParse = file.originalname.split(".");
                          var imgtype               = originalfilenameParse.pop();
                          var writepath             = path.join(pubhtmlpath, filename + "." + imgtype);
                          var filepath              = "http://localhost/public/images/users/"+ filename + "." + imgtype;
                          fs.readFile(file.path, function (err, data)
                          {
                              fs.writeFile(writepath, data, function (err)
                              {
                                  if (err)
                                  {
                                      console.log(err);
                                  }
                                  else
                                  {
                                      console.log("SUCCESSFUL Image File Upload");
                                      User
                                          .query()
                                          .patchAndFetchById(res.locals.user.id, {profilepicture: filepath})
                                          .then(media =>
                                                {
                                                    console.log("SUCCESSFUL inserted mediapath into DB");
                                                })
                                          .catch(err =>
                                                 {
                                                     console.log(err);
                                                 });
                                  }
                              });
                          });
                      });
    return next();

}

// needed to generate hash for new user password
function sha512(password, salt)
{
    let hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt        : salt,
        passwordHash: value
    };
}

function storeUserCredentials(req, res, next)
{
    let data    = {};
    let counter = 0;
    // check if mail is set
    // check for second mail as first is always present
    if (req.body['mail2'].length > 3)
    {
        // check if mails match
        if (req.body.mail1 === req.body.mail2)
        {
            data.email = req.body.mail1;
            counter++;
        } else
        {
            // no match
            req.flash('error', 'Emails do not match');
        }
    }
    // check if password is set
    if (req.body['password1'].length > 0)
    {
        // check if passwords match (no specific rules for now)
        if (req.body.password1 === req.body.password2)
        {
            data.password = sha512(req.body.password1, res.locals.user.salt).passwordHash;
            counter++;
        } else
        {
            // no match
            req.flash('error', 'Passwords do not match');
        }
    }
    // if we got some actual data (for now: no checking if different from db data)
    if (counter > 0)
    {
        User
            .query()
            .patchAndFetchById(res.locals.user.id, data)
            .then(user =>
                  {
                      // set success message
                      req.flash('info', 'New Credentials successfully saved');
                      return next();
                  })
            .catch(err =>
                   {
                       // on error: show the user
                       req.flash('error', err);
                       res.redirect('/fa17g16/user/edit');
                   });
    } else
    {
        return next();
    }
}

function handleNewFamilyMember(req, res, next)
{
    let data = {
        name              : req.body.familyMemberName,
        type              : req.body.familyMemberType.toLowerCase(),
        age               : parseInt(req.body.familyMemberAge),
        usePublicTransport: 0,
        user_id           : res.locals.user.id
    };
    if (req.body.hasOwnProperty('familyMemberPublicTransport'))
        data.usePublicTransport = 1;
    Family.query()
          .insert(data)
          .then(success =>
                {
                    req.flash('info', 'New family member added with ID: ' + success.id);
                    return next();
                })
          .catch(err =>
                 {
                     req.flash('error', err);
                     res.redirect('/fa17g16/user/edit');
                 });
}


function handleRemoveFamilyMember(req, res, next)
{
    Family
        .query()
        .deleteById(parseInt(req.body.id))
        .then(numberOfDeletedRows =>
              {
                  req.flash('info', 'Removed ' + numberOfDeletedRows + ' family member');
                  return next();
              })
        .catch(err =>
               {
                   req.flash('error', err);
                   res.redirect('/fa17g16/user/edit');
               });

}

function handleAdress(req, res, next)
{
    let zipcode = 0;
    if (!isNaN(parseInt(req.body.zipcode_id)))
        zipcode = parseInt(req.body.zipcode_id);
    if (req.body.street !== '' && req.body.zipcode !== '' && req.body.location !== '')
    {
        Zipcode.query().findById(zipcode)
               .then(zipcode =>
                     {
                         if (zipcode === undefined || zipcode.zipcode !== req.body.zipcode ||
                             zipcode.location !== req.body.location ||
                             res.locals.userdata.adress.street !== req.body.street)
                         {
                             Zipcode.query()
                                    .where('zipcode', 'like', '%' + req.body.zipcode + '%')
                                    .andWhere('location', 'like', '%' + req.body.location + '%')
                                    .limit(2)
                                    .then(data =>
                                          {
                                              if (data.length === 0)
                                              {
                                                  req.flash(
                                                      'error', ' No Adress found for combination of zipcode="' +
                                                               req.body.zipcode + '" and location="' +
                                                               req.body.location + '"');
                                                  return next();
                                              }
                                              if (data.length === 1)
                                              {
                                                  Adress.query()
                                                        .patchAndFetchById(
                                                            res.locals.user.adress_id,
                                                            {zipcode_id: data[0].id, street: req.body.street}
                                                        )
                                                        .then(user =>
                                                              {
                                                                  req.flash(
                                                                      'info', 'New Address successfully saved');
                                                                  return next();
                                                              })
                                                        .catch(err =>
                                                               {
                                                                   req.flash('error', err);
                                                                   return next();
                                                               });
                                              }
                                              if (data.length === 2)
                                              {
                                                  req.flash(
                                                      'error', ' More than one Adress found for combination of zipcode="' +
                                                               req.body.zipcode + '" and location="' +
                                                               req.body.location + '"');
                                                  return next();
                                              }
                                          })
                                    .catch(err =>
                                           {
                                               req.flash('error', err);
                                               return next(err);
                                           });
                         } else
                         {
                             return next();
                         }
                     });
    } else
    {
        req.flash('info', 'No address information provided.');
        return next();
    }
}

function handlePublicTransportTrigger(req, res, next)
{
    knex.raw(
        'update user_families set usePublicTransport = (usePublicTransport+1)%2 where id = ?',
        parseInt(req.params.famID)
    ).then(result =>
           {
               if (result.length === 2)
               {
                   req.flash('info', 'Updated ' + result[0].affectedRows +
                                     ' family members setting for public transport');
               } else
               {
                   req.flash('error', 'an error accured trying to update family member with id: ' +
                                      req.params.famID + ' (please check error log)');
                   console.error(result);
               }
               return next();
           });
}

/*
 Routes handled in this controller
 */

// GET Dashboard of actual athenticated user
router.get('/', function (req, res, next)
{
    // Unauthorized users are not allowed to enter this area
    if (req.isAuthenticated())
    {
        res.redirect('/fa17g16/user/dashboard');
    }
    else
    {
        return res.back();
    }
});

// Render Dashboard for actual athenticated user
router.get(
    '/dashboard', getUserRoles, getBuyerdata, getSellerdata, getAgentdata, getAdmindata, function (req, res, next)
    {
        // Unauthorized users are not allowed to enter this area
        if (req.isAuthenticated())
        {
            res.render('user/dashboard', {
                data: {
                    title     : 'Dashboard',
                    buyerdata : req.buyerdata,
                    sellerdata: req.sellerdata,
                    agentdata : req.agentdata,
                    admindata : req.admindata,
                    local     : {stylesheets: ['dashboard.css']}
                }
            });
        }
        else
        {
            res.redirect('/fa17g16');
        }
    });

function testAuthentication(req, res, next)
{
    if (req.isAuthenticated())
    {
        next();
    }
    else
    {
        req.flash('error', 'You landed here because you were not allowed to do what you did! :)');
        setTimeout(function ()
                   {
                       return res.back();
                   }, 15);
    }
}

// Get Registration mask
router.get('/reg', function (req, res, next)
{
    res.render('user/register', {title: 'Register'});
});
// Trigger REGESTRATION
router.post('/reg', register);
// TriggerLOGIN
router.post('/login', login);
// Trigger LOGOUT
router.get('/logout', function (req, res)
{
    req.logout();
    setTimeout(function ()
               {
                   res.redirect('/fa17g16'); //Can fire before session is destroyed?
               }, 50);
});
// Routes that are needed to control the Edit of profile
router.post('/edit/credentials', testAuthentication, storeUserCredentials, redirectToEditPage);
router.post('/edit/details', testAuthentication, storeUserData, handleAdress, redirectToEditPage);
router.post('/edit/profilepicture', testAuthentication, storeProfilepicture, redirectToEditPage);
router.get('/edit', testAuthentication, getUserData, renderUserEdit);
router.post('/edit/family/add', testAuthentication, handleNewFamilyMember, redirectToEditPage);
router.post('/edit/family/delete', testAuthentication, handleRemoveFamilyMember, redirectToEditPage);
router.get('/edit/family/trigger/public/:famID', testAuthentication, handlePublicTransportTrigger, redirectToEditPage);
router.get('/:userID', getUserData, renderUserEdit);
module.exports = router;
