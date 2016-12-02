var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Verifies if this user is enrolled in this community
        communityController.isUserEnrolledInCommunity(db, req.user, communityName, function (community) {
            // Get this community offers
            offerController.getCommunityOffers(db, communityName, function (offers) {
                db.close();

                // If user is not enrolled in the community, no community should have been returned
                if (community == null) {
                    res.redirect('/');
                } else {
                    res.render('community/community_page',
                        {
                            communityName: communityName,
                            offerArr: offers
                        });
                }
            });
        });
    });
});

module.exports = router;