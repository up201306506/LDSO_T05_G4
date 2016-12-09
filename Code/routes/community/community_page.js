var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // TEMP
    var tempOfferArr = [
        {
            communityName: 'Comunidade',
            offerName: 'Oferta',
            offerDescription: 'BLAH BLAH BLAH blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
        },
        {
            communityName: 'Comunidade',
            offerName: 'Oferta',
            offerDescription: 'BLAH BLAH BLAH blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
        }
    ];

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
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
                            db.close();

                            // If user is not enrolled in the community and had already requested to join
                            if (community == false && requestdone == true) {
                                res.render('community/community_page',
                                    {
                                        communityName: communityName,
                                        privacy: privacy,
                                        enrolled: 0,
                                        pedido: 1,
                                        admin: admin
                                    });
                            // If user is not enrolled in the community and still hasn't requested to join
                            } else if (community == false && requestdone == false) {
                                res.render('community/community_page',
                                    {
                                        communityName: communityName,
                                        privacy: privacy,
                                        enrolled: 0,
                                        pedido: 0,
                                        admin: admin
                                    });
                            // If user is enrolled in the community
                            } else {
                                res.render('community/community_page',
                                    {
                                        communityName: communityName,
                                        offerArr: tempOfferArr,
                                        privacy: privacy,
                                        enrolled: 1,
                                        pedido: 2,
                                        admin: admin
                                    });
                            }
                        });
                    });
                });
            });

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