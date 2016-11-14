var express = require('express'),
    router = express.Router(),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../controllers/UserController'),
    communityController = require('./../controllers/CommunityController'),
    userPrivileges = require('./../config/userPrivileges');

router.get('/', userPrivileges.ensureAuthenticated, function (req, res, next) {

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

    mongo.connect(configDB.url, function (err, db, next) {
        // Get this user information
        userController.getUser(db, req.user, function (userdata) {
            // Get this user enrolled communities from the db
            communityController.getUserEnrolledCommunities(db, userdata.username, function (communities) {
                // TODO Get all offers visible to this user

                // TODO Eventually this following block of code will be contained by the block above to be done
                db.close();

                res.render('main_page',
                    {
                        title: 'Local Exchange - Main page',
                        communityArr: communities,
                        offerArr: tempOfferArr
                    });
            });
        });
    });
});

module.exports = router;