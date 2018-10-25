/*##############################################################################
 _     _  _____  ______  _______
| |   | |/ ___ \|  ___ \(_______)                        
| |__ | | |   | | | _ | |_____   ____   ____  ____  ____ 
|  __)| | |   | | || || |  ___) |  _ \ / _  |/ _  |/ _  )
| |   | | |___| | || || | |_____| | | ( ( | ( ( | ( (/ / 
|_|   |_|\_____/|_||_||_|_______) ||_/ \_||_|\_|| |\____)
                                |_|         (_____|      
Participants: Micha
Description: 
This file contains functions and API interfaces that are needed in context of
rating an agent or real estate (including commenting on them)
API interfaces:
 ---------------
 /agent/:agentid => store agent rating
 /estate/:estateid => store real estate rating
##############################################################################*/

var express = require('express');
var router  = express.Router();

var passport    = require('passport');
const objection = require('objection');
const Model     = objection.Model;
var knexfile    = require('../knexfile');//db config
const Knex      = require('knex'); // db layer
const knex      = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const Rateable = require('../models/Rateable');

// redirect user back to previous page
function redirectBackAfterSend(req, res, next)
{
    return res.back();
}

// store agent rating in database
function commentOnAgent(req, res, next)
{
    let rate = Rateable
        .query()
        .insert([
                    {
                        user_id      : res.locals.user.id,
                        rateable_type: 'agent',
                        rateable_id  : parseInt(req.params.agentid),
                        rating       : parseInt(req.body.rating),
                        comment      : req.body.comment
                    }]);
    rate.then(result =>
              {
                  req.flash('info', 'Rating (' + result[0].rating + ' stars) for agent successfully stored');
                  setTimeout(function() {
                    res.redirect('back');
                  }, 15);
              })
        .catch(err =>
               {
                   req.flash('error', err);
                   setTimeout(function() {
                     res.redirect('back');
                   }, 15);
               });
}

// store real estate rating in database
function commentOnRealEstate(req, res, next)
{
    let rate = Rateable
        .query()
        .insert([
                    {
                        user_id      : res.locals.user.id,
                        rateable_type: 'real_estate',
                        rateable_id  : parseInt(req.params.estateid),
                        rating       : parseInt(req.body.rating),
                        comment      : req.body.comment
                    }]);
    rate.then(result =>
              {
                  req.flash('info', 'Rating (' + result[0].rating + ' stars) for real estate successfully stored');
                  return next();
              })
        .catch(err =>
               {
                   req.flash('error', err);
                   return next();
               });
}

function testAuthentication(req, res, next)
{
    if (req.isAuthenticated())
    {
        next();
    }
    else
    {
        req.flash('error', 'You are not logged in. Rating and Commenting requires you to be logged in!');
        let route = req.originalUrl.split('/')[3];
        if (route.localeCompare('agent') || route.localeCompare('estate'))
            redirectBackAfterSend(req, res, next);
        else
            res.redirect('/fa17g16');
    }
}

function checkComment(req, res, next)
{
    if (req.body.comment.length === 0)
        req.body.comment = '<i>No comment</i>';
    return next()
}

/* GET home page. */
router.post('/agent/:agentid', testAuthentication, checkComment, commentOnAgent, redirectBackAfterSend);
router.post('/estate/:estateid', testAuthentication, checkComment, commentOnRealEstate, redirectBackAfterSend);
module.exports = router;
