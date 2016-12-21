var express = require('express'),
    router = express.Router(),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../controllers/CommunityController'),
    offerController = require('./../controllers/OfferController'),
    userPrivileges = require('./../config/userPrivileges'),
    messageController = require('./../controllers/MessageController');

router.get('/', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // Connects to the db
    mongo.connect(configDB.url, function (err, db, next) {
        // Verifies in which page the user is
        var page = req.query.page;
        if(!page){
            page = 1;
        }

        //Range
        var pageSize = 10;
        var range = {from:(pageSize*(page-1)), size:pageSize};

        // Get this user enrolled communities from the db
        communityController.getUserEnrolledCommunities(db, req.user, true, function (communities) {
            // ESTE OFFER VAI SER INUTIL COM A DASHBOARD
            offerController.getCommunityListOffers(db, communities, range, function (offers, totalOffersCount) {
                messageController.getMessagesByUser(db,req.user,function (received) {
                    messageController.getSentByUser(db,req.user,function (sent) {
                            db.close();
                            res.render('main_page',
                                {
                                    title: 'Local Exchange - Main page',
                                    communityArr: communities,
                                    offerArr: offers,
                                    nPages: Math.ceil(totalOffersCount/pageSize),
                                    thisPage: page,
                                    sentArray: sent,
                                    receivedArray: received
                                });
                    });
                });

            });
        });
    });
});

router.get('/maintenance', function (req, res) {
    res.render('maintenance', {
        title: 'Site is under maintenance',
        error_msg: "The database is undergoing maintenance"
    });
});

module.exports = router;