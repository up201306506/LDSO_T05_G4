var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');


router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Get list of users in requests
        communityController.getCommunityData(db, communityName, function (community_data) {
            db.close();
            console.log(community_data.requests);
            res.render('community/accept_requests',
                {
                    communityName: communityName,
                    requests: community_data.requests
                });
        });
    });
});

router.get('/:communityName/:user/accept', userPrivileges.ensureAuthenticated, function (req, res, next) {
    var communityName = String(req.params.communityName);
    var userName = String(req.params.user);
    console.log(communityName);
    console.log(userName);
    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        communityController.removeFromRequests(db, communityName, userName, function (community_data) {
            communityController.insertUserInCommunity(db, communityName, userName, function (community_data) {
                db.close();
            });
        });
    });
    console.log("accept");
    res.redirect("/accept_requests/"+communityName);
});

router.get('/:communityName/:user/remove', userPrivileges.ensureAuthenticated, function (req, res, next) {
    var communityName = String(req.params.communityName);
    var userName = String(req.params.user);
    console.log(communityName);
    console.log(userName);
    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        communityController.removeFromRequests(db, communityName, userName, function (community_data) {
            db.close();
        });
    });
    console.log("remove");
    res.redirect("/accept_requests/"+communityName);
});

module.exports = router;