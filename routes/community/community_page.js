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
        // Verifies the page the user is in
        var page = req.query.page;
        if(!page){
            page = 1;
        }

        //Range
        var pageSize = 10;
        var range = {from:(pageSize*(page-1)), size:pageSize};

        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Get this community offers
            offerController.getCommunityOffers(db, communityName, range, function (offers, totalOffersCount) {
                // Closes db
                db.close();

                var isModeratorBool = false;

                console.log(req.user);
                console.log(isModeratorBool);

                console.log(community.admins);

                if(community.admins.indexOf(req.user) != -1)
                    isModeratorBool = true;

                console.log(isModeratorBool);

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
                        offerArr: offers,
                        isMod: isModeratorBool,
                        nPages: Math.ceil(totalOffersCount/2),
                        thisPage: page,
                        user: req.user
                    });
            });
        });
    });
});


router.get('/:communityName/join_community/', userPrivileges.ensureAuthenticated, function (req, res, next) {
// GET community name from url
    var communityName = String(req.params.communityName);
    mongo.connect(configDB.url, function (err, db) {


        communityController.isUserEnrolledInCommunity(db, req.user, communityName, function (community) {
            communityController.getCommunityData(db, communityName, function (result) {

                // If user is not enrolled in the community, insert request to join if "Privada" or insert user on community if "Pública"
                if (community == false) {
                    if(result.privacy == "Privada") {
                        communityController.insertRequests(db, communityName, req.user, function (callb) {
                            db.close();
                        });
                    } else if(result.privacy == "Pública") {
                        communityController.insertUserInCommunity(db, communityName, req.user, function (result) {
                            db.close();
                        });
                    }
                // Else meh
                } else {

                    //....

                }

            });

        });

    });
    res.redirect("/community/"+communityName);

});

module.exports = router;