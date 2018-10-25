/*##############################################################################
_     _  _____  ______  _______                         
| |   | |/ ___ \|  ___ \(_______)                        
| |__ | | |   | | | _ | |_____   ____   ____  ____  ____ 
|  __)| | |   | | || || |  ___) |  _ \ / _  |/ _  |/ _  )
| |   | | |___| | || || | |_____| | | ( ( | ( ( | ( (/ / 
|_|   |_|\_____/|_||_||_|_______) ||_/ \_||_|\_|| |\____)
                                |_|         (_____|      
Participants: Tim, Micha, Anastasia, Moritz, Gabin
Description:
This file contains routes to the individual sites of each team member. 
The team members defined specific information in "data" which should be availabe 
to work with in their view.
##############################################################################*/

var express = require('express');
var router = express.Router();

router.get('/about', function (req, res, next) {
    res.render('about/about', {title: 'About Us'});
});

/*
 Routes handled in this controller
 */
router.get('/micha', function (req, res, next) {
    res.render('about/micha', {
        title: 'About: Micha',
        "data": {
            "career": {
                "education":
                    [{
                        "year": "XX/20XX - heute",
                        "title": "Master of Science - Applied Informatics"
                    }, {
                        "year": "XX/20XX - XX/20XX",
                        "title": "Bachelor of Science - Businessinformatics"
                    }, {
                        "year": "XX/20XX - XX/20XX",
                        "title": "Apprenticeship Informatikkaufmann"
                    }, {"year": "XX/20XX - XX/20XX", "title": "Vocational Diploma Businessinformatics"}],
                "professional":
                    [{
                        "year": "XX/20XX - heute",
                        "title": "Research Associate - Researchproject IntErA - Emphasis IT-Security, Softwarearchitecture, Software Development and Enhancement"
                    }, {
                        "year": "XX/20XX - XX/20XX",
                        "title": "Tutor - Researchproject SecLab - Emphasis on IT-Security, Software Development and Enhancement"
                    }, {
                        "year": "XX/20XX - XX/20XX",
                        "title": "Part Time - Support, Projectmanagement and Consulting in the fields of Datawarehousing, Budgetplaning und external Interfaces (Webshop / EDIFACT)"
                    }, {
                        "year": "XX/20XX - XX/20XX",
                        "title": "Full Time - Support, Projectmanagement and Consulting in the fields of Datawarehousing, Budgetplaning und external Interfaces (Webshop / EDIFACT)"
                    }, {
                        "year": "XX/20XX - XX/20XX",
                        "title": "Apprenticeship Informatikkaufmann"
                    }]
            },
            "projects":
                [{
                    "title": "Laravel PHP FFMPEG - Slideshow creation from user-selected pictures",
                    "skill": "Apache2, PHP7, FFMPEG, MariaDB, VueJS, Bootstrap"
                }, {
                    "title": "PHP - CRM + Tour-Planing",
                    "skill": "Apache2, PHP5.6, MariaDB, Bootstrap"
                }, {
                    "title": "Data consolidation and conversion to switch Data Warehouse Systems",
                    "skill": "PHP,MariaDB"
                }, {
                    "title": "Internal Shopsystem for more than 400 branches",
                    "skill": "Apache2, IIS, MSSQL, MySQL"
                }, {
                    "title": "Systemarchitecture for IntErA",
                    "skill": "Java, Apache Storm, Gitlab Hosting, Debian Server Administration"
                }, {
                    "title": "Intranet Portal for staff Bowling-Events",
                    "skill": "Planing, Registration, Statistics"
                }, {
                    "title": "Projectmanagement and Consulting at höltl Retail Solutions (6 years)",
                    "skill": "Customer Contact, Customer Training, Projectmanagement, Software Support"
                }, {
                    "title": "Accounting system for entering booking records and automatic handling for balance sheet, inventory and expense accounts, P & L, account closure",
                    "skill": "PHP4"
                }],
            local:
                {
                    "stylesheets": ["style_about_micha.css"]
                }
        }
    });
})
;
router.get('/tim', function (req, res, next) {
    res.render('about/tim', {
        title: 'About: Tim',
        "data": {
            local:
              {
                  "stylesheets": ["style_about_tim.css"]
              },
            "education": [
                {"year": "2000-2006", "name": "Grundschule <br> MPS Angersbach"},
                {"year": "2006-2010", "name": "Realschule <br> Schule an der Wascherde Lauterbach"},
                {"year": "2010-2012", "name": "Fachoberschule Fachrichtung Wirtschaftsinformatik <br> VBS Lauterbach"},
                {
                    "year": "2012-2016",
                    "name": "Bachelor Fachrichtung Wirtschaftsinformatik <br> University of Applied Science Fulda"
                },
                {
                    "year": "since 2016",
                    "name": "Master Fachrichtung Angewandte Informatik <br> University of Applied Science Fulda"
                }
            ]
        }
    });
});
router.get('/moritz', function (req, res, next) {
    res.render('about/moritz', {title: 'About: Moritz'});
});
router.get('/anastasia', function (req, res, next) {
    res.render('about/anastasia', {
      title: 'About: Anastasia',
      "data": {
        local:
            {
                "stylesheets": ["style_about_anastasia.css"]
            }
        }
    });
});
router.get('/gabin', function (req, res, next) {
    res.render('about/gabin', {
      title: 'About: Gabin',
      "data": {
        local:
            {
                "stylesheets": ["style_about_gabin.css"]
            }
        }
    });
});

module.exports = router;
