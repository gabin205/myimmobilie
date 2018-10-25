/*##############################################################################
 _     _  _____  ______  _______
| |   | |/ ___ \|  ___ \(_______)                        
| |__ | | |   | | | _ | |_____   ____   ____  ____  ____ 
|  __)| | |   | | || || |  ___) |  _ \ / _  |/ _  |/ _  )
| |   | | |___| | || || | |_____| | | ( ( | ( ( | ( (/ / 
|_|   |_|\_____/|_||_||_|_______) ||_/ \_||_|\_|| |\____)
                                |_|         (_____|      
Participants: Anastasia
Description: 
This file contains functions and API interfaces that are needed in context of
setting appointments
API interfaces:
 ---------------
 /appointment => set appointment
 /appointments/:user_id => get appointments for user
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
const Appointment = require('../models/Real_Estate_Appointment');

function setAppointment(req, res, next)
{
    appointment = req.body.date + " " + req.body.time;
    Appointment
        .query()
        .insert([
            {
                real_estate_id: parseInt(req.body.real_estate_id),
                agent_id: res.locals.user.id,
                user_id: parseInt(req.body.buyer_id),
                appointment: appointment
            }])
        .then(answer =>
        {
            req.answer = answer;
            return next();
        })
        .catch(err =>
        {
            req.flash("error", err);
            res.locals.sessionFlash = {"error": err};
            return next();
        });
}

function getAppointments(req, res, next)
{
    user_id = res.locals.user.id;
    Appointment
        .query()
        .where('agent_id', user_id).orWhere('user_id', user_id)
        .eager('[user, agent, realty.[adress.zipcode]]')
        .then(appointments =>
        {
            req.appointments = appointments;
            next();
        })
        .catch(err =>
        {
            next(err);
        });
}

// redirect user back to previous page
function renderViewAfterSend(req, res)
{
    res.redirect('back');
}

function resAppointments(req, res)
{
    res.json({
        data: {
            appointments: req.appointments
        }
    });
}

router.post('/appointment', setAppointment, renderViewAfterSend);
router.get('/appointments/:user_id', getAppointments, resAppointments, renderViewAfterSend);


module.exports = router;
