var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

router.get('/:username', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET username from url
    var username = String(req.params.username);

    // Creates a var that indicates if this profile is this user profile
    var isOwnProfile = (username == req.user);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the user information
        userController.getUser(db, username, function (userData) {
            db.close();

            res.render('profile/view',
                {
                    title: 'Local Exchange - View Profile',
                    username: username,
                    isOwnProfile: isOwnProfile,
                    password: userData.password,
                    name: userData.name,
                    phone: userData.phone,
                    gender: userData.gender,
                    email: userData.email
                });
        });
    });
});

router.get('/edit/:username', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET username from url
    var username = String(req.params.username);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the user information
        userController.getUser(db, username, function (userData) {
            db.close();

            res.render('profile/edit',
                {
                    title: 'Local Exchange - View Profile',
                    userdata: userData,
                    username: username,
                    password: userData.password,
                    name: userData.name,
                    phone: userData.phone,
                    gender: userData.gender,
                    email: userData.email,
                    genderList: dropdownList.genderList
                });
        });
    });
});

router.post('/edit/:username', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET username from url
    var username = String(req.params.username);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Edit the user information
        userController.editUser(db, username, req.body.password, req.body.name, req.body.email, req.body.phone, req.body.gender, function (wasEdited) {
            db.close();

            // If user was edited
            if (wasEdited) {
                // TODO req.flash, mensagens de erro
                res.redirect('/profile/' + username);
            } else {
                res.redirect('/profile/edit/' + username);
            }
        });
    });
});

module.exports = router;