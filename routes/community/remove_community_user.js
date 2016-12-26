var express = require('express');
var router = express.Router();
var assert = require('assert');
var userPrivileges = require('./../../config/userPrivileges');
var communityController = require('./../../controllers/CommunityController');
var mongo = require('mongodb').MongoClient;
var configDB = require('./../../config/dbURL.js');

router.get('/:communityName/:userName', userPrivileges.ensureAuthenticated, function (req, res, next)  {

    var communityName = String(req.params.communityName);
    var userName = String(req.params.userName);

    mongo.connect(configDB.url, function (err, db) {

        communityController.removeUserFromCommunity(db, communityName, userName, function (error) {
            db.close();
            if (error)
                req.flash('success_msg', 'Utilizador removido com sucesso');
            else
                req.flash('error_msg', 'Utilizador ainda existe na comunidade');
            res.redirect('/');
        });
    });
});

module.exports = router;