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
 the search functionality.

 API interfaces:
 ---------------
 /search => Search real estates
 /search/filter => Search real estates with active filters
 /search/agencies => Search real estate agencies
 /search/agencies/:agencyId => Search all real estate agents to a specific real estate agency
 /search/adress => api to enable ajax calls to search for available adresses (json return)
 /search/adress/zipcode => modified version of adress search to handle only zipcodes returning only distinct values

 functions:
 ---------
 getRealEstateEquipment => DB logic that queries all real_estate_equipment
 getRealEstate => DB logic that queries all real_estates to the corresponding
 search parameters
 getRealEstateAgencies => DB logic that queries all real_estate_agencies to the
 corresponding search parameters
 getRealEstateAgents => DB logic that queries all real_estate_agents to the
 corresponding search parameters
 renderSearchresultPage => Render the result page for real estate search
 renderEstateAgencies => Render the result page for real estate agency search
 renderEstateAgents => Render the result page for real estate agents search
 ##############################################################################*/

var express = require('express');
var router  = express.Router();

const objection = require('objection');
const Model     = objection.Model;
var knexfile    = require('../knexfile');//db config
const Knex      = require('knex'); // db layer
const knex      = Knex(knexfile.development);// db config selection
Model.knex(knex); // bind model + db layer
const Real_Estate_Equipment = require('../models/Real_Estate_Equipment');
const Real_Estate           = require('../models/Real_Estate');
const Agencies              = require('../models/Real_Estate_Agency');
const Search                = require('../models/Search');
const Zipcode               = require('../models/Zipcode');

//INFO: https://stackoverflow.com/questions/28128323/rendering-view-after-multiple-select-queries-in-express
//Database Query for fetching all available real_estate_equipment
function getRealEstateEquipment(req, res, next)
{
    Real_Estate_Equipment.query()
        .then(data =>
        {
            req.real_estate_equipment = data;
            return next();
        })
        .catch(err =>
        {
            return next(err);
        });
}

// example search query with synthetic search data
function getRealEstate(req, res, next)
{
    // logik for min/max cost/space defaults
    console.log("minCost:" , req.body.minCost);
    console.log("maxCost:" , req.body.maxCost);
    console.log("search:" , req.body.searchplace);
    console.log("body:" , req.body);
    if (req.body.minCost === '') req.body.minCost = 0;
    if (req.body.minSpace === '') req.body.minSpace = 0;
    if (req.body.maxCost === '') req.body.maxCost = 99999999;
    if (req.body.maxSpace === '') req.body.maxSpace = 99999999;
    // frontend checks are nice but there are ways to bypass them
    // so no data goes to the db without some previous checks
    if (req.body.minCost < 0) req.body.minCost = 0;
    if (req.body.minCost > req.body.maxCost) req.body.minCost = req.body.maxCost;
    if (req.body.minSpace < 0) req.body.minSpace = 0;
    if (req.body.minSpace > req.body.maxSpace) req.body.minSpace = req.body.maxSpace;
    // initial query (based on always present params)
    let query = Real_Estate
        .query()
        .whereBetween('cost', [req.body.minCost, req.body.maxCost])
        .andWhereBetween('size', [req.body.minSpace, req.body.maxSpace])
        .applyFilter('onlyActive')
        .eager('[medias, equipment, adress.zipcode, seller]');

    // use search filter if present
    if (req.body.hasOwnProperty('searchplace'))
    {
        let searchstring = req.body.searchplace.replace(', ', ' ').split(' ');
        let numbers      = true;
        let search       = {zipcode: '', location: ''};
        let x;
        for (x in searchstring)
        {
            if (numbers)
            {
                if (isNaN(searchstring[x]))
                    numbers = false;
                else
                    search.zipcode += searchstring[x] + '%';
            }
            if (!numbers)
            {
                search.location += searchstring[x] + '%';
            }
        }
        search.location = search.location.substring(0, search.location.indexOf('function (a)'));
        if (search.zipcode.length === 0)
            search.zipcode = '99999';
        if (search.location.length === 0)
            search.location = 'ZZZZZZZZZZZZZZZZZZZZZ';
        query.joinRelation('adress.zipcode')
            .where(function ()
            {
                this.where('adress:zipcode.zipcode', 'like', '%' +
                    search.zipcode +
                    '%')
                    .orWhere('adress:zipcode.location', 'like', '%' +
                        search.location +
                        '%');
            });

        console.log(query.debug());
        console.log(search);

    }

    if (req.body.hasOwnProperty('equipment'))
    {
        query.joinRelation('equipment')
            .whereIn('equipment.equipment_name', req.body.equipment)
            .groupBy('id');
    }

    //console.log(search.debug());
    query.then(data =>
    {
        //console.log(data);
        req.real_estate = data;
        return next();
    })
        .catch(err =>
        {
            return next(err);
        });
}

function saveSearch(req, res, next)
{
    if (req.isAuthenticated())
    {
        searchString = JSON.stringify(req.body);
        Search.query()
            .insert({user_id: res.locals.user.id, search_json: searchString})
            .then(search =>
            {
                next();
            })
            .catch(err =>
            {
                next(err);
            });
    }
    else
    {
        next();
    }
}

function getRealEstateAgenciesJson(req, res, next)
{
    Agencies.query()
        .eager('[agents.[agent_ratings],adress,manager]')
        .then(data =>
        {
            return res.json({data});
        })
        .catch(err =>
        {
            return next(err);
        });
}

function getRealEstateAgencies(req, res, next)
{
    Agencies.query()
        .eager('[agents.[agent_ratings,selling_real_estate],adress,manager]')
        .then(data =>
        {
            req.agencies = data;
            return next();
        })
        .catch(err =>
        {
            return next(err);
        });
}

function getRealEstateAgents(req, res, next)
{
    Agencies.query().findById(parseInt(req.params.agencyID))
        .eager('[agents.[adress,agent_ratings,favorite_agent,advertisements,selling_real_estate]]')
        .then(data =>
        {
            //console.log(data);
            req.agents = data;
            return next();
        })
        .catch(err =>
        {
            return next(err);
        });
}

function getAdressesToJson(req, res, next)
{

    let searchstring = req.body.search.split(' ');
    let numbers      = true;
    let search       = {zipcode: '', location: ''};
    let x;
    for (x in searchstring)
    {
        if (numbers)
        {
            if (isNaN(searchstring[x]))
                numbers = false;
            else
                search.zipcode += searchstring[x] + '%';
        }
        if (!numbers)
        {
            search.location += searchstring[x] + '%';
        }
    }
    search.location = search.location.substring(0, search.location.indexOf('function (a)'));
    Zipcode.query()
        .where('zipcode', 'like', '%' + search.zipcode + '%')
        .andWhere('location', 'like', '%' + search.location + '%')
        .then(data =>
        {
            //console.log(data);
            return res.json({data});
        })
        .catch(err =>
        {
            req.flash('error', err);
            return next(err);
        });
}

function getZipcodesToJson(req, res, next)
{
    //console.log(req.body.search);
    //console.log(req.body.search.indexOf('function (a)'));
    let searchstring = req.body.search.substring(0, req.body.search.indexOf('function(a)')).split(' ');
    let numbers      = true;
    let search       = {zipcode: '', location: ''};
    let x;
    for (x in searchstring)
    {
        if (numbers)
        {
            if (isNaN(searchstring[x]))
                numbers = false;
            else
                search.zipcode += searchstring[x] + '%';
        }
        if (!numbers)
        {
            search.location += searchstring[x] + '%';
        }
    }
    search.location = search.location.substring(0, search.location.indexOf('function (a)'));
    Zipcode.query()
        .distinct('zipcode')
        .where('zipcode', 'like', '%' + search.zipcode + '%')
        .andWhere('location', 'like', '%' + search.location + '%')
        .then(data =>
        {
            //console.log(data);
            return res.json({data});
        })
        .catch(err =>
        {
            req.flash('error', err);
            return next(err);
        });
}

/*
 compile data and render view
 */
/**
 * Rendering the Response to Search Request with data of database queries
 * @param req
 * @param res
 */
function renderSearchresultPage(req, res, next)
{
    res.render('search/search', {
        data: {
            equipments: req.real_estate_equipment,
            result: req.real_estate,
            formdata: req.body
        },
        title: 'Searchresults'
    });
}
/*
 compile data and render view
 */
/**
 * Rendering the Response to Search Request with data of database queries
 * @param req
 * @param res
 */
function renderSearchresultJson(req, res, next)
{
        res.json({
        data: {
            equipments: req.real_estate_equipment,
            result: req.real_estate,
            formdata: req.body
        }
    });
}
/**
 * Rendering the Response to show Real_Estate_Agencies with data of database queries
 * @param req
 * @param res
 */
function renderEstateAgencies(req, res, next)
{
    res.render(
        'search/agencies',
        {
            data:
                {
                    agencies: req.agencies,
                    local: {stylesheets: ['section_padding.css']}
                },
            title: 'Overview Real Estate Agencies'
        }
    );
}

/**
 * Rendering the Response to show Real_Estate_Agents with data of database queries
 * @param req
 * @param res
 */
function renderEstateAgents(req, res, next)
{
    res.render('search/agents', {
        data: {
            agents: req.agents,
            local: {stylesheets: ['section_padding.css','agent-class.css']}
        },
        title: 'Agents of ' + req.agents.name
    });
}


/*
 Routes handled in this controller
 */
// actual search
router.post('/', getRealEstateEquipment, getRealEstate, saveSearch, renderSearchresultPage);
// android
router.post('/android', getRealEstateEquipment, getRealEstate, saveSearch, renderSearchresultJson);
// not needed
router.post('/filter', getRealEstateEquipment, getRealEstate, renderSearchresultPage);
// other stuff ;)
router.get('/agencies', getRealEstateAgenciesJson);
router.get('/agencies/show', getRealEstateAgencies, renderEstateAgencies);
router.get('/agencies/show/:agencyID', getRealEstateAgents, renderEstateAgents);
router.post('/adress/', getAdressesToJson);
router.post('/adress/zipcode', getZipcodesToJson);
module.exports = router;