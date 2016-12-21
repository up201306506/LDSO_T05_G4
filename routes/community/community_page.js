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

        //Verifica em que página está
        var page = req.query.page;
        if(!page){
            page = 1;
        }

        //Range
        var pageSize = 10;
        var range = {from:(pageSize*(page-1)), size:pageSize};

        // Verifies if this user is enrolled in this community
        communityController.isUserEnrolledInCommunity(db, req.user, communityName, function (community) {
            // Gets the info from the community
            communityController.getCommunityData(db, communityName, function (result) {
                // Verifies if user is in the requests field
                communityController.verifyUserRequest(db, req.user, communityName, function (requestdone) {
                    // Gets the privacy from the community
                    communityController.getCommunityPrivacy(db, communityName, function (privacy) {
                        //Verifies if user is admin
                        communityController.isAdmin(db, communityName, req.user, function (admin) {
                            // Get this community offers
                            offerController.getActiveOffers(db, communityName, range, function (offers, totalOffersCount) {
                                db.close();

                                // If user is not enrolled in the community and had already requested to join
                                if (community == false && requestdone == true) {
                                    res.render('community/community_page',
                                        {
                                            communityName: communityName,
                                            privacy: privacy,
                                            enrolled: 0,
                                            pedido: 1,
                                            admin: admin,
                                            user: req.user
                                        });
                                // If user is not enrolled in the community and still hasn't requested to join
                                } else if (community == false && requestdone == false) {
                                    res.render('community/community_page',
                                        {
                                            communityName: communityName,
                                            privacy: privacy,
                                            enrolled: 0,
                                            pedido: 0,
                                            admin: admin,
                                            user: req.user
                                        });
                                // If user is enrolled in the community
                                } else {
                                    res.render('community/community_page',
                                        {
                                            communityName: communityName,
                                            offerArr: offers,
                                            privacy: privacy,
                                            enrolled: 1,
                                            pedido: 2,
                                            admin: admin,
                                            nPages: Math.ceil(totalOffersCount/2),
                                            thisPage: page,
                                            user: req.user
                                        });
                                }
                            });
                        });
                    });
                });
            });

            // Get this community offers
            /*offerController.getCommunityOffers(db, communityName, range, function (offers, totalOffersCount) {
                db.close();

                // If user is not enrolled in the community, no community should have been returned
                if (community == null) {
                    res.redirect('/');
                } else {
                    res.render('community/community_page',
                        {
                            communityName: communityName,
                            offerArr: offers,
                            nPages: Math.ceil(totalOffersCount/2),
                            thisPage: page
                        });
                }
            });*/

        });


    });
});


// O post ainda não está a dar
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