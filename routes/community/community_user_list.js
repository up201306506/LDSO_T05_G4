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
                    thisUser: req.user,
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

router.post('/change_member/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name
    var communityName = String(req.params.communityName);

    // Gets username from post
    var userName = req.body.userName;

    // Boolean to further logic
    var addToAdminBool = false;
    if(req.body.permissions == 'admin')
        addToAdminBool = true;

    // Connects to database
    mongo.connect(configDB.url, function (err, db) {
        // Add admin
        if(addToAdminBool){
            // Add user to community's admins
            communityController.insertAdminInCommunity(db, communityName, userName);
        } else {
            // Remove user from community's admins
            communityController.removeAdminFromCommunity(db, communityName, userName);
        }

        // Closes DB
        db.close();

        // Redirects to user list page
        res.redirect('/community_users/' + communityName);
    });
});

router.post('/remove_member/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name
    var communityName = String(req.params.communityName);

    // Gets username from post
    var userName = req.body.userName;

    // Connects to database
    mongo.connect(configDB.url, function (err, db) {
        // Remove member from community
        communityController.removeUserFromCommunity(db, communityName, userName);

        // Closes DB
        db.close();

        // Redirects to user list page
        res.redirect('/community_users/' + communityName);
    });
});

module.exports = router;