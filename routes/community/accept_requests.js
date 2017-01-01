var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // GET community name
    var communityName = String(req.params.communityName);

    // Connects to database
    mongo.connect(configDB.url, function (err, db) {
        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Closes DB
            db.close();

            res.render('community/accept_requests',
                {
                    title: 'Local Exchange - Pedidos de Adesão',
                    communityName: communityName,
                    requests: community.requests
                });
        });
    });
});

router.post('/accept_member/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name
    var communityName = String(req.params.communityName);

    // Gets username from post
    var userName = req.body.userName;

    // Connects to database
    mongo.connect(configDB.url, function (err, db) {
        // Remove user request from community
        communityController.removeFromRequests(db, communityName, userName, function () {
            // Insert user in community
            communityController.insertUserInCommunity(db, communityName, userName, function () {
                // Closes DB
                db.close();

                // Redirects to user list page
                res.redirect('/accept_requests/' + communityName);
            });
        });
    });
});

router.post('/reject_member/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name
    var communityName = String(req.params.communityName);

    // Gets username from post
    var userName = req.body.userName;

    // Connects to database
    mongo.connect(configDB.url, function (err, db) {
        // Remove user request from community
        communityController.removeFromRequests(db, communityName, userName, function () {
            // Closes DB
            db.close();

            // Redirects to user list page
            res.redirect('/accept_requests/' + communityName);
        });
    });
});

module.exports = router;