var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    userPrivileges = require('./../../config/userPrivileges'),
    communityController = require('./../../controllers/CommunityController');

router.get('/:communityName', userPrivileges.ensureAuthenticated, function(req, res, next) {
    // GET community name from url
    var name = String(req.params.communityName);

    mongo.connect(configDB.url, function (err, db) {
        console.log(communityController.isUserEnrolledInCommunity(db, "LDSO", "pedro.pereira.95@hotmail.com"));
        //console.log(communityController.isUserEnrolledInCommunity(db, "LDSO", "pedro.pereira@hotmail.com"));
        //console.log(communityController.isUserEnrolledInCommunity(db, "LD", "pedro.pereira.95@hotmail.com"));

        db.close();
    });

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

    res.render('community/community_page',
        {
            title: name,
            offerArr: tempOfferArr
        });
});

module.exports = router;