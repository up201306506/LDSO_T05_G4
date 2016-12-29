var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res, next)  {
    // GET community name
    var communityName = String(req.params.communityName);

    // Connects to database
    mongo.connect(configDB.url, function (err, db) {
        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Closes DB
            db.close();

            // Gets this user community permissions
            var isModeratorBool = false;
            if(community.admins.indexOf(req.user) != -1)
                isModeratorBool = true;

            res.render('community/community_user_list',
                {
                    title: 'Local Exchange - Lista de Utilizadores',
                    isModerator: isModeratorBool,
                    communityName: communityName,
                    founder: community.founder,
                    useCoin: community.useCoin,
                    coinName: community.coinName,
                    admins: community.admins,
                    members: community.members
                });
        });
    });
});

module.exports = router;