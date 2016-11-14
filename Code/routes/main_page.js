var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('../controllers/CommunityController'),
    userController = require('../controllers/UserController'),
    userPrivileges = require('./../config/userPrivileges');

/* GET users listing. */
router.get('/', userPrivileges.ensureAuthenticated, function(req, res, next) {

    // TEMP
    var tempOfferArr = [
        {
            communityName: 'Comunidade',
            offerName: 'Oferta',
            offerDescription: 'BLAH BLAH BLAH blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
        },
        {
            communityName: 'Comunidade',
            offerName: 'Oferta',
            offerDescription: 'BLAH BLAH BLAH blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
        }
    ];

    // Get this user enrolled communities from the db
    mongo.connect(configDB.url, function (err, db, next) {
        userController.getUser(db, req.user, function (err, userdata) {
            communityController.getUserEnrolledCommunities(db, userdata.email, function (communityDocs) {
                db.close();

                var tempCommunityArr = communityDocs;

                res.render('main_page',
                    {
                        title: 'Local Exchange - Main page',
                        communityArr: tempCommunityArr,
                        offerArr: tempOfferArr
                    });
            })
        });
    });
});

module.exports = router;