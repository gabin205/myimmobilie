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

// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
// load up the user model
const User = require('../models/User');
const Role = require('../models/Role');
const objection = require('objection');
const Model = objection.Model;
var knexfile = require('../knexfile');//db config
const Knex = require('knex'); // db layer
const knex = Knex(knexfile.development);// db config selection
var crypto = require('crypto');
Model.knex(knex); // bind model + db layer

function sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
}

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        done(null, true);
    });
    
    // method used for registration 
    passport.use(
        'local-signup',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, email, password, done) {
                let salt = getRandomString(16);
                let passwd = sha512(password, salt);
                console.log(passwd);
                req.body.password = passwd.passwordHash;
                req.body.salt = passwd.salt;
                
                User.query()
                  .insert([req.body])
                  /*
                  .insertGraph({
                    "#id": 'user',
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    salt: req.body.salt,
                    password: req.body.password,
                    
                    roles: [
                      {user_id: 1, role_id: 1}
                    ]
                  })*/       
                  .then(function (user) {
                    if (!(user[0] == null)){
                      knex('user_roles')
                      .insert({user_id: user[0].id, role_id: 1})
                      .then(user_role1 => {
                        console.log(user_role1);
                      });
                      knex('user_roles')
                      .insert({user_id: user[0].id, role_id: 2})
                      .then(user_role2 => {
                        console.log(user_role2);
                      });
                      return done(null, user);
                    }
                    else {
                      return done(null, false);
                    }
                }).catch(err => {console.log(err)});
            }
        )
    );
    
    // method used for login 
    passport.use(
      'local-login',
      new LocalStrategy(
        // get needed parametes out of post request
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        // check user credentials
        function (req, email, password, done) {
          // check if user with given email address is in db
          User.query().where('email', email)
            .then(function (user) {
              // check if given password matches with password in db
              if (!(user[0] == null) && (sha512(password, user[0].salt).passwordHash == user[0].password)) {
                  console.log("user_id passport", user[0].id);
                  return done(null, user, {message: 'Yeahh - You know your credentials!', user_id: user[0].id} );
              }
              else {
                  return done(null, false, {message: 'Ooops - Think about again!'});
              }
            });
        }
      )
    );
};
