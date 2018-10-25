/*##############################################################################
 _     _  _____  ______  _______
| |   | |/ ___ \|  ___ \(_______)                        
| |__ | | |   | | | _ | |_____   ____   ____  ____  ____ 
|  __)| | |   | | || || |  ___) |  _ \ / _  |/ _  |/ _  )
| |   | | |___| | || || | |_____| | | ( ( | ( ( | ( (/ / 
|_|   |_|\_____/|_||_||_|_______) ||_/ \_||_|\_|| |\____)
                                |_|         (_____|      
Participants: Gabin
Description: 
API interfaces:
 ---------------
 /favoriten/...
##############################################################################*/

var express = require('express');
var router  = express.Router();

const objection = require('objection');
const Model     = objection.Model;
var knexfile    = require('../knexfile');//db config
const Knex      = require('knex'); // db layer
const knex      = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const Favorable = require('../models/Favorable');


/*********/
// redirect user back to previous page
function redirectBackAfterSend(req, res)
{
    console.log("favorable", req.body.real_estateId);
    setTimeout(function () {
        res.redirect('back');
    }, 15);

}


// store Favorite in database
function addFavoriteOnProfile(req, res, next) {
    console.log("favorite", res.locals.user.id);

    Favorable.query()
        .insert([
            {
                user_id:res.locals.user.id,
                favorable_type: 'real_estate',
                favorable_id: parseInt(req.body.real_estateId),
            }
        ])
        .then(result => {
        req.flash('info', 'Favorite (' + req.body.real_estateId + ') real_estate in favorit successfully stored');
    redirectBackAfterSend(req, res);
})
.catch(err =>
    {
        req.flash('error', "you can not favorite the same thing twice!");
    redirectBackAfterSend(req, res);
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
        req.flash('error', 'You landed here because you were not allowed to do what you did! :)');
        setTimeout(function() {
            res.redirect('/fa17g16/');
        }, 15);
    }
}


//get Favorite from database
function getFavoriteEstate(req, res, next)
{
    user_id = res.locals.user.id;
    Favorable.query()
        .where('favorable.user_id', user_id)
        .eager('[real_estate.medias]')
        .then(data =>
    {
        req.favorite_real_estate = data;
    next();
})
.catch(err =>
{
    next(err);
});

}

function resFavoriteEstate(req, res)
{
    res.json({
        data: {
            favorite_real_estate: req.favorite_real_estate
        }
    });
}


/* GET home page. */
router.post('/real_estate/:real_estateid', testAuthentication, addFavoriteOnProfile);
router.get('/real_estate/:user_id', testAuthentication, getFavoriteEstate, resFavoriteEstate);
module.exports = router;
