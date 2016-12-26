var express = require('express');
var router = express.Router();
var assert = require('assert');
var userPrivileges = require('./../../config/userPrivileges');
var communityController = require('./../../controllers/CommunityController');
var mongo = require('mongodb').MongoClient;
var configDB = require('./../../config/dbURL.js');
var userController = require('./../../controllers/UserController');
/* GET community user list page. */
router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res, next)  {

    //var isMod = userPrivileges.isModerator();
    var communityName = String(req.params.communityName);

    mongo.connect(configDB.url, function (err, db) {

        communityController.getCommunityUsers(db,communityName,function (community) {

            db.close();
            res.render('community/community_user_list',
                {
                    title: 'Community List Of Users',
                    isModerator: "true",
                    communityName: communityName,
                    users: community.members
                });
        })
    });
});

module.exports = router;