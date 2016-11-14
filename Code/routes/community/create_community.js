var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/', userPrivileges.ensureAuthenticated, function (req, res) {
    res.render('community/create_community', {title: 'New Community'});
});

router.post('/create', userPrivileges.ensureAuthenticated, function (req, res) {
    // Verifies if the form is completed
    req.checkBody('communityName', 'Nome da comunidade necessário').notEmpty();
    req.checkBody('hq', 'Sede da comunidade necessária').notEmpty();
    req.checkBody('description', 'Descricao da comunidade necessária').notEmpty();

    // If an error is found an error message will be displayed
    var errors = req.validationErrors();
    if (errors) {
        res.render('community/create_community', {
            title: 'New Community',
            errors: errors
        });
    } else {
        // If no error is found a new community will be created
        mongo.connect(configDB.url, function (err, db, next) {
            // Gets this user information
            userController.getUser(db, req.user, function (userdata) {
                // Insert a new community in the db
                communityController.insertCommunity(db, req.body.communityName, req.body.hq, req.body.category,
                    userdata.username, req.body.description, req.body.privacy, [userdata.username]);
            });
        });

        // The main page will be rendered
        req.flash('success_msg', 'Comunidade criada com sucesso');
        res.redirect('/');
    }
});

module.exports = router;