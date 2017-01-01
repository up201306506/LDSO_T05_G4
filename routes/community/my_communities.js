var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/', userPrivileges.ensureAuthenticated, function (req, res) {
    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets communities administrated by this user
        communityController.getUserAdminCommunities(db, req.user, function (communities) {
            // Closes db
            db.close();

            // Renders the page
            res.render('community/my_communities',
            {
                title: 'Local Exchange - Minhas Comunidades',
                communities: communities
            });
        });
    });
});

module.exports = router;