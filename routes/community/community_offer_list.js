var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

/* GET community offer list page. */
router.get('/:communityName', function (req, res) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Verifies the page the user is in
        var page = req.query.page;
        if (!page) {
            page = 1;
        }

        //Range
        var pageSize = 10;
        var range = {from: (pageSize * (page - 1)), size: pageSize};

        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Get this community offers
            offerController.getActiveOffers(db, communityName, range, function (offers, totalOffersCount) {
                // Closes db
                db.close();

                // Renders page
                res.render('community/community_page',
                    {
                        communityName: community.name,
                        communityOffice: community.office,
                        communityDescription: community.description,
                        communityRules: community.ruleDescription,
                        useCoin: community.useCoin,
                        coinName: community.coinName,
                        privacy: community.privacy,
                        admins: community.admins,
                        members: community.members,
                        offers: offers,
                        nPages: Math.ceil(totalOffersCount / 2),
                        thisPage: page,
                        user: req.user
                    });
            });
        });
    });
});

module.exports = router;