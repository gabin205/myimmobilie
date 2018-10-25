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
messaging. This includes to send a message, to write an answer to a message, and
to get all necessary message data that is needed in specific context.  
 ##############################################################################*/
var express = require('express');
var router  = express.Router();

const objection = require('objection');
const Model     = objection.Model;
var knexfile    = require('../knexfile');//db config
const Knex      = require('knex'); // db layer
const knex      = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const Conversation = require('../models/Conversation');
const Message      = require('../models/Message');
const User         = require('../models/User');
const Real_Estate  = require('../models/Real_Estate');
const Adress       = require('../models/Adress');
const ZipCode      = require('../models/Zipcode');

function testAuthentication(req, res, next)
{
    console.log('testAuthentication: ', req.isAuthenticated());
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

function contactRequest(req, res, next)
{
    //parent_id must be NULL because contactrequest is start of conversation
    var receiver_id = parseInt(req.params.receiver_id);
    //First insert a new message
    //console.log(res.locals.user.id);
    Message
        .query()
        .insert([
            {
                type: 'message',
                sender_id: res.locals.user.id,
                receiver_id: receiver_id,
                header: req.body.header,
                body: req.body.body,
                real_estate_id: parseInt(req.body.real_estate),
            }])
        .then(message =>
        {
            req.message = message[0];
            //console.log("message", req.message);
            return next();
        })
        .catch(err =>
        {
            //console.log("error", req.flash);
            req.flash('error', err);
          setTimeout(function() {
            res.redirect('back');
          }, 15);
        });
}


function contactRequestAndroid(req, res, next)
{
    console.log('contactRequestAndroid');
    console.log("receiver", req.params.receiver_id);
    console.log(req.params);
    console.log(req.body);
    //parent_id must be NULL because contactrequest is start of conversation
    var receiver_id = parseInt(req.params.receiver_id);
    //First insert a new message
    console.log(res.locals.user);
   // console.log(res.locals.user.id);
    console.log("receiver", receiver_id);
    var obj = {
        type: 'message',
        sender_id: parseInt(req.body.sender_id), //58, // res.locals.user.id,
        receiver_id: receiver_id,
        header: req.body.header,
        body: req.body.body,
        real_estate_id: parseInt(req.body.real_estate),
    };
    console.log(obj);
    Message
        .query()
        .insert([
            obj])
        .then(message =>
    {
        req.message = message[0];
    console.log("message", req.message);
    return next();
})
.catch(err =>
{
    console.log("error", req.flash);
    req.flash('error', err);
    setTimeout(function() {
        res.redirect('back');
    }, 15);
});
}

function advertisementRequest(req, res, next)
{
    //parent_id must be NULL because contactrequest is start of conversation
    var receiver_id = parseInt(req.params.receiver_id);
    console.log("HEADER:"+req.body.header);
    console.log("BODY:"+req.body.body);

    var header        = ((req.body.header === "") ? "Default Header" : req.body.header);
    var body          = ((req.body.body === "") ? "Hello Agent - please sell my house" : req.body.header);
    //First insert a new message
    Message
        .query()
        .insert([
            {
                type: 'agent_contact',
                sender_id: res.locals.user.id,
                receiver_id: receiver_id,
                header: header,
                body: body,
                real_estate_id: req.body.newRealEstate,
            }])
        .then(message =>
        {
            req.message = message[0];
            return next();
        })
        .catch(err =>
        {
          req.flash('error', err);
          setTimeout(function() {
            res.redirect('back');
          }, 15);
        });
}

function createRealEstate(req, res, next)
{
    var receiver_id = parseInt(req.params.receiver_id);

    var size        = (((req.body.size === "") || (parseInt(req.body.size) <= 0 )) ? 1 : parseInt(req.body.size));
    var cost        = (((req.body.cost === "") || (parseInt(req.body.cost) <= 0 )) ? 1 : parseInt(req.body.cost));
    var header      = ((req.body.header === "") ? "Default Header" : req.body.header);
    //var header        = (((req.body.header === "") || (parseInt(req.body.cost) <= 0 )) ? 1 : parseInt(req.body.cost));
    Real_Estate
        .query()
        .insert([
            {
                adress_id: req.body.newAdress,
                owner_id: res.locals.user.id,
                header: header,
                seller_id: receiver_id,
                size: size,
                cost: cost,
            }])
        .then(real_estate =>
        {
            req.body.newRealEstate = real_estate[0].id;
            next();
        })
        .catch(err =>
        {
          req.flash('error', err);
          setTimeout(function() {
            res.redirect('back');
          }, 15);
        });
}

function createAdress(req, res, next)
{
    Adress
        .query()
        .insert([
            {
                street: req.body.street,
                zipcode_id: req.body.zipID,
            }])
        .then(adress =>
        {
            req.body.newAdress = adress[0].id;
            next();
        })
        .catch(err =>
        {
          req.flash('error', err);
          setTimeout(function() {
            res.redirect('back');
          }, 15);
        });
}

function requestZIP(req, res, next)
{
    var ZIParr = req.body.location.replace(/ /g, '').split(',');
    ZipCode
        .query()
        .where('zipcode', ZIParr[0])
        .andWhere('location', ZIParr[1])
        .then(zip =>
        {
            req.body.zipID = zip[0].id;
            next();
        })
        .catch(err =>
        {
          req.flash('error', err);
          setTimeout(function() {
            res.redirect('back');
          }, 15);
        });
}

function createConversation(req, res, next)
{
    console.log("createConversation");
    Conversation
        .query()
        .insert([
            {
                msg_id: req.message.id,
            }])
        .then(conversation =>
        {
            req.conversation = conversation[0];

            // We must use manual created queries based on knex because insertGraph()
            // funtionality of objection does not work as aspected
            // Isert of participants of conversation
            knex('message_conversation_participants')
                .insert({conversation_id: req.conversation.id, user_id: req.message.sender_id})
                .then(participant1 =>
                {
                    req.participant1 = participant1[0];
                });
            knex('message_conversation_participants')
                .insert({conversation_id: req.conversation.id, user_id: req.message.receiver_id})
                .then(participant2 =>
                {
                    req.participant2 = participant2[0];
                });
            return next();
        })
        .catch(err =>
        {
          req.flash('error', err);
          setTimeout(function() {
            res.redirect('back');
          }, 15);
        });
}


function createConversationAndroid(req, res)
{
    console.log("createConversation");
    Conversation
        .query()
        .insert([
            {
                msg_id: req.message.id,
            }])
        .then(conversation =>
    {
        req.conversation = conversation[0];

    // We must use manual created queries based on knex because insertGraph()
    // funtionality of objection does not work as aspected
    // Isert of participants of conversation
    knex('message_conversation_participants')
        .insert({conversation_id: req.conversation.id, user_id: req.message.sender_id})
        .then(participant1 =>
    {
        req.participant1 = participant1[0];
});
    knex('message_conversation_participants')
        .insert({conversation_id: req.conversation.id, user_id: req.message.receiver_id})
        .then(participant2 =>
    {
        req.participant2 = participant2[0];
});
    return "es hat funktioniert";
})
.catch(err =>
{
    req.flash('error', err);
    setTimeout(function() {
        res.redirect('back');
    }, 15);
});
}

function sendAnswer(req, res, next)
{
    var message_id = parseInt(req.params.message_id);
    Message
        .query()
        .insert([
            {
                type: 'message',
                sender_id: res.locals.user.id,
                receiver_id: parseInt(req.body.receiver_id),
                parent_id: message_id,
                header: req.body.header,
                body: req.body.body,
            }])
        .then(answer =>
        {
            req.answer = answer;
            return next();
        })
        .catch(err =>
        {
            req.flash('error', err);
            setTimeout(function() {
              res.redirect('back');
            }, 15);
        });

}

function getAllConversations(req, res, next)
{
    User
        .query()
        .where('id', res.locals.user.id)
        .eager('conversations.participants')
        .then(conversations =>
        {
            req.conversations = conversations;
            return next();
        })
        .catch(err =>
        {
            next(err);
        });
}

function getAllMessagesToConversation(req, res, next)
{
    conversation_id = req.params.conversation_id;
    Conversation
        .query()
        .where('id', conversation_id)
        //eager sender = sender of last message
        .eager('[participants, message.[answers.^, sender]]')
        .then(messages =>
        {
            req.messagesToConversation = messages;
            next();
        })
        .catch(err =>
        {
            next(err);
        });

}

function renderViewAfterSend(req, res)
{
    res.redirect('back');
}

function resConversations(req, res)
{
    res.json({
        data: {
            messagesToConversation: req.conversations,
        },
    });
}

function resMessagesToConversation(req, res)
{
    res.json({
        data: {
            messagesToConversation: req.messagesToConversation,
        },
    });
}

/*
 Routes handled in this controller
 */
router.post('/contactrequest/:receiver_id', testAuthentication, contactRequest, createConversation, renderViewAfterSend);
router.post('/contactrequest/android/:receiver_id', contactRequestAndroid, createConversationAndroid);
router.post(
    '/advertisementrequest/:receiver_id', testAuthentication, requestZIP, createAdress, createRealEstate, advertisementRequest, createConversation, renderViewAfterSend);
router.post('/answer/:message_id', testAuthentication, sendAnswer, renderViewAfterSend);
router.get('/show', testAuthentication, getAllConversations, resConversations);
router.get('/show/:conversation_id', testAuthentication, getAllMessagesToConversation, resMessagesToConversation);


module.exports = router;
