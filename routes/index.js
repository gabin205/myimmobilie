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
This file contains functions and API interfaces that are needed in context of
the landing page of this website
##############################################################################*/

var express = require('express');
var router  = express.Router();

var passport = require('passport');
const objection = require('objection');
const Model = objection.Model;
var knexfile = require('../knexfile');//db config
const Knex = require('knex'); // db layer
const knex = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next)
{
  res.render('index', {title: 'Welcome to HOMEpage', pw: process.env.MYSQL_PW});
});

module.exports = router;
