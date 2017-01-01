var express = require('express'),
    router = express.Router(),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../controllers/UserController'),
    communityController = require('./../controllers/CommunityController');

router.get('/search', function (req, res) {

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets all non secret communities
        communityController.getAllCommunities(db, ".", false, function (communities) {
            // Gets all users
            userController.getAllUsers(db, ".", function (users) {
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

router.post('/search', function (req, res) {

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets all non secret communities
        communityController.getAllCommunities(db, req.body.search, false, function (communities) {
            // Gets all users
            userController.getAllUsers(db, req.body.search, function (users) {
                // Closes db
                db.close();

                // Does not show users if client is not logged in
                var userList = users;
                if (!req.user)
                    userList = [];

                // Renders the page
                res.render('search_results',
                    {
                        title: 'Local Exchange - Página de resultados',
                        term: req.body.search,
                        communities: communities,
                        users: userList
                    });
            });
        });
    });
});

module.exports = router;