var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    userPrivileges = require('./../config/userPrivileges'),
    mongo = require('mongodb').MongoClient,
    configDB = require('./../config/database.js'),
    userController = require('../controllers/UserController');



/* View profile */
router.get('/', userPrivileges.ensureAuthenticated, function (req, res) {

    var userProfile = req.user;
    if(typeof req.query.username != 'undefined'){
        userProfile = req.query.username;
    }

    mongo.connect(configDB.url, function (err, db, next) {
        userController.getUser(db, userProfile, function (err, userdata) {
            db.close();
            res.render('profile/view', {title: 'Local Exchange', userdata: userdata});
        });
    });
});

/* Get Edit Profile page */
router.get('/edit', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db, next) {
        userController.getUser(db, req.user, function (err, userdata) {
            db.close();
            res.render('profile/edit', {title: 'Local Exchange', userdata: userdata});
        });
    });
});

module.exports = router;