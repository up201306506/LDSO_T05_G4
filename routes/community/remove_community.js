var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/:delete_community', userPrivileges.ensureAuthenticated, function (req, res) {
    // Connects to the db
    var communityName = String(req.params.delete_community);
    mongo.connect(configDB.url, function (err, db) {
        // Verifies if this user is enrolled in this community
        communityController.getCommunityData(db, communityName, function (communityData) {

            if (communityData == null) {
                res.redirect('/');
            }
            else if(req.user == communityData.founder)
            {
                communityController.removeCommunity(db,communityData.name,function (error) {
                    db.close();
                    if (!error)
                        req.flash('success_msg', 'Comunidade removida com sucesso');
                    else
                        req.flash('error_msg', 'Comunidade ainda existe');
                    res.redirect('/');
                });
            }
        });
    });
});

module.exports = router;