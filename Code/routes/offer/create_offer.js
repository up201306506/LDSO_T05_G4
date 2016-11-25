var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    offerController = require('./../../controllers/OfferController')
    userPrivileges = require('./../../config/userPrivileges');

var multer  = require('multer');
var upload = multer({ dest: 'temp/images/offer/' });

router.get('/:communityName', userPrivileges.ensureAuthenticated, function(req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    res.render('offer/create_offer',
        {
            communityName: communityName
        });
});

router.post('/:communityName/create', userPrivileges.ensureAuthenticated, upload.single("offer_image"), function(req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // TODO
    req.checkBody('offerTitle', 'Título da oferta é necessário').notEmpty();
    req.checkBody('offerDescription', 'Username é necessário').notEmpty();

    var fileName = "";
    if(req.file) fileName = req.file.filename;

    var errors = req.validationErrors();
    if (errors) {
        res.render('offer/create_offer', {
            communityName: communityName,
            errors: errors
        });
    } else {
        // If no error is found a new offer will be created
        mongo.connect(configDB.url, function (err, db, next) {
            // Insert a new offer in the db
            offerController.insertOffer(db, req.user, communityName, req.body.offerTitle, req.body.offerDescription, req.body.offerPrice,
                req.body.offerType, fileName, false, Date.now(), function (wasCreated) {
                    db.close();

                    req.flash('success_msg', 'Oferta criada com sucesso');
                    res.redirect('/community/' + communityName);
                });
            });
    }
});

module.exports = router;
