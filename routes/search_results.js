var express = require('express'),
    router = express.Router(),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../controllers/UserController'),
    communityController = require('./../controllers/CommunityController'),
    userPrivileges = require('./../config/userPrivileges');

router.post('/search', function (req, res) {

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets all non secret communities
        communityController.getAllCommunities(db, req.body.search, false, function (communities) {
            // Gets all users
            userController.getAllUsers(db, req.body.search, function (users) {
                // Closes db
                db.close();

                // Renders the page
                res.render('search_results',
                    {
                        title: 'Local Exchange - Página de resultados',
                        term: req.body.search,
                        communities: communities,
                        users: users
                    });
            });
        });
    });
});

module.exports = router;