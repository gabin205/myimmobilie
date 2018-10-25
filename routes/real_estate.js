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
working with a real_estate
##############################################################################*/

var express = require('express');
var router  = express.Router();

var path         = require('path');
var fs           = require("fs");
var randomstring = require("randomstring");

const objection = require('objection');
const Model     = objection.Model;
var knexfile    = require('../knexfile');//db config
const Knex      = require('knex'); // db layer
const knex      = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const Real_Estate           = require('../models/Real_Estate');
const Real_Estate_Equipment = require('../models/Real_Estate_Equipment');
const Real_Estate_Media     = require('../models/Real_Estate_Media');

Array.prototype.diff = function (a)
{
    return this.filter(function (i)
                       {
                           return a.indexOf(i) < 0;
                       });
};

Array.prototype.sim = function (a)
{
    return this.filter(function (i)
                       {
                           return a.indexOf(i) >= 0;
                       });
};

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

/*
 Functions to handle db queries and logik
 */
function getReal_Estate(req, res, next)
{

    Real_Estate
        .query()
        .findById(req.params.real_estateId)
        // we currently dont have testing data with real advertisements
        //.joinRelation('advertisements')
        //.whereIn('advertisements:real_estate_id', req.params.real_estateID)
        .eager('[medias, equipment, adress.zipcode, seller.agency]')
        .then(data =>
              {
                  if (data == undefined)
                  {
                      req.flash('error', 'This real estate is not available');
                      req.real_estate = {not_allowed: true};
                      return res.back();
                  }
                  else
                  {
                      if (data.isActive === 1)
                      {
                          req.real_estate = data;
                          next();
                      } else
                      {
                          if (req.session.passport != null && req.session.passport.user != null)
                          {
                              if (req.session.passport.user[0].isAdmin === 1)
                              {
                                  //req.flash('info', 'This real estate is not publicly available. You are able
                                  // to view it because you are an admin');
                                  req.real_estate = data;
                                  next();
                              }
                              else if (data.seller_id === req.session.passport.user[0].id)
                              {
                                  //req.flash('info', 'This real estate is not publicly available. You are able
                                  // to view it because you are the seller');
                                  req.real_estate = data;
                                  next();
                              }
                              else if (data.owner_id === req.session.passport.user[0].id)
                              {
                                  //req.flash('info', 'This real estate is not publicly available. You are able
                                  // to view it because you are the owner');
                                  req.real_estate = data;
                                  next();
                              } else
                              {
                                  req.flash('error', 'This real estate is not publicly available');
                                  req.real_estate = {not_allowed: true};//in case redirect fails
                                  setTimeout(function() {
                                      return res.back();
                                  }, 50);
                              }
                          } else
                          {
                              req.flash(
                                  'error',
                                  'This real estate is not publicly available. Note: You are not logged in'
                              );
                              req.real_estate = {not_allowed: true};//in case redirect fails
                              setTimeout(function() {
                                  return res.back();
                              }, 50);
                          }
                      }
                  }
              })
        .catch(err =>
               {
                   next(err);
               });
}

function getRealEstateEquipment(req, res, next)
{
    Real_Estate_Equipment.query()
                         .then(data =>
                               {
                                   req.real_estate_equipment = data;
                                   next();
                               })
                         .catch(err =>
                                {
                                    next(err);
                                });
}

function savePictures(req, res, next)
{
    //console.log(req.files);
    var pubhtmlpath = path.join(__dirname,  '..', '..', '..', '..', 'var', 'www', 'html', 'public', 'images', 'houses');

    // Check if real_estate has already image folder
    var real_estate_path = path.join(pubhtmlpath, req.real_estate.id.toString());
    if (!fs.existsSync(real_estate_path))
    {
        fs.mkdirSync(real_estate_path);
    }
    // Write the images out of req into public html
    req.files.forEach(function (file)
                      {
                          //generate randomString for unique file name
                          var filename              = randomstring.generate();
                          var originalfilenameParse = file.originalname.split(".");
                          var imgtype               = originalfilenameParse.pop();
                          var writepath             = path.join(real_estate_path, filename + "." + imgtype);
                          var filepath              = path.join(
                              "http://192.168.73.186/public/images/houses/",
                              req.real_estate.id.toString(), filename + "." + imgtype
                          );
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
                                      Real_Estate_Media
                                          .query()
                                          .insert([
                                                      {
                                                          type     : "picture",
                                                          path     : filepath,
                                                          estate_id: req.real_estate.id
                                                      }])
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

function editInformation(req, res, next)
{
    console.log(req.body);

    for (var ob in req.body)
    {
        if (req.body[ob] == undefined || req.body[ob] == "")
        {
            console.log("not given attribute");
        }
        else if ([ob] == "isActive")
        {
            //Do nothing
        }
        else
        {
            Real_Estate
                .query()
                .patchAndFetchById(req.real_estate.id, {
                    //test if the value is a field what should be a number (Parsing)
                    [ob]: (([ob] == "cost" || [ob] == "size" || [ob] == "running_cost" || [ob] == "rooms") ?
                           parseInt(req.body[ob]) : req.body[ob])
                })
                .then(updated =>
                      {
                          console.log(updated);
                      })
                .catch(err =>
                       {
                           req.flash('error', err);
                       });
        }
    }
    //activate or deactivate
    Real_Estate
        .query()
        .patchAndFetchById(req.real_estate.id, {
            isActive: (!(req.body.isActive == undefined) ? 1 : 0)
        })
        .then(updated =>
              {
                  console.log(updated);
              })
        .catch(err =>
               {
                   req.flash('error', err);
               });
    //Guarantee read query
    setTimeout(function ()
               {
                   req.flash('info', "Valid informations were updated successful!");
                   next();
               }, 1000);
}

function removeEquipments(real_estate, toRemove, next)
{
    knex('real_estate_equipments')
        .where('real_estate_id', real_estate)
        .andWhereIn('real_estate_equipment_id', toRemove)
        .del()
        .then(deleted =>
              {
                  console.log("SUCCESSFUL deleted equipment rows");
                  return next();
              })
        .catch(err =>
               {
                   next(err);
               });
}

function editExtras(req, res, next)
{
    //initialize Array of new equipment data
    if (req.body.equipment == undefined)
    {
        formdata = [];
    }
    else
    {
        formdata = req.body.equipment;
    }

    //initialize and fill Array of actual equipment data
    exdata = [];
    for (var i in req.real_estate.equipment)
    {
        if (req.real_estate.equipment[i].equipment_name != undefined)
        {
            exdata.push(req.real_estate.equipment[i].equipment_name);
        }
    }

    //Calculate Changes in equipment
    var newFields     = formdata.diff(exdata);
    var stayedFields  = formdata.sim(exdata);
    var removedFields = exdata.diff(stayedFields);

    //DELETE removed equipments
    for (var i in req.real_estate_equipment)
    {
        if (removedFields.includes(req.real_estate_equipment[i].equipment_name))
        {
            removeEquID = parseInt(req.real_estate_equipment[i].id);
            knex('real_estate_equipments')
                .where('real_estate_id', parseInt(req.real_estate.id))
                .andWhere('real_estate_equipment_id', removeEquID)
                .del()
                .then(deleted =>
                      {
                          req.flash('info', "Successful deleted selected extra");
                          console.log("SUCCESSFUL deleted equipment row");
                      })
                .catch(err =>
                       {
                           req.flash('error', err);
                           console.log(err);
                       });
        }
    }
    //ADD new equipments
    for (var i in req.real_estate_equipment)
    {
        if (newFields.includes(req.real_estate_equipment[i].equipment_name))
        {
            newEquID = parseInt(req.real_estate_equipment[i].id);
            knex('real_estate_equipments')
                .insert({real_estate_id: parseInt(req.real_estate.id), real_estate_equipment_id: newEquID})
                .then(added =>
                      {
                          req.flash('info', "Successful added selected extra");
                          console.log("SUCCESSFUL inserted new equipment row");
                      })
                .catch(err =>
                       {
                           req.flash('error', err);
                           console.log(err);
                       });
        }
    }
    //Guarantee read query
    setTimeout(function ()
               {
                   next();
               }, 1000);
}


/**
 * Rendering the Response to Sear Request with data of database queries
 */
function renderRealEstatePage(req, res)
{
    res.render('real_estate/estate', {
        data : {
            real_estate: req.real_estate,
            local      : {stylesheets: ['section_padding.css', 'calc_layout.css']}
        },
        title: 'View Real Estate Estate: ' + req.real_estate.header
    });
}

function renderEditRealEstatePage(req, res)
{
    res.render('real_estate/edit', {
        data : {
            equipments : req.real_estate_equipment,
            real_estate: req.real_estate
        },
        title: 'Edit Real Estate: ' + req.real_estate.header
    });
}

function redirectEditRealEstatePage(req, res)
{
    setTimeout(function ()
               {
                   res.redirect('/fa17g16/real_estate/edit/' + req.real_estate.id)
               }, 20);
}

function results(req, res, next)
{
    return res.json({real_estate: req.real_estate
    });
}

/*
 Routes handled in this controller
 */
router.get('/:real_estateId', getReal_Estate, renderRealEstatePage);

//router.get('/:real_estateId', getReal_Estate, results);

//android
router.get('/:real_estateId/android', getReal_Estate, results);

router.get(
    '/edit/:real_estateId', testAuthentication, getReal_Estate, getRealEstateEquipment, getReal_Estate,
    renderEditRealEstatePage
);
router.post(
    '/edit/:real_estateId', testAuthentication, getReal_Estate, getRealEstateEquipment, editInformation, getReal_Estate,
    redirectEditRealEstatePage
);
router.post(
    '/edit/images/:real_estateId', testAuthentication, getReal_Estate, getRealEstateEquipment, savePictures,
    getReal_Estate, renderEditRealEstatePage
);
router.post(
    '/edit/extras/:real_estateId', testAuthentication, getReal_Estate, getRealEstateEquipment, editExtras,
    getReal_Estate, redirectEditRealEstatePage
);


module.exports = router;