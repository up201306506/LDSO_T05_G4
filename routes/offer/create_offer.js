var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

var multer  = require('multer');
var upload = multer({ dest: 'public/images/offers/' });

router.get('/:communityName', userPrivileges.ensureAuthenticated, function(req, res) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Closes DB
            db.close();

            res.render('offer/create_offer',
                {
                    title: 'Local Exchange - Criar Oferta',
                    communityName: communityName,
                    useCoin: community.useCoin,
                    coinName: community.coinName
                });
        });
    });
});

router.post('/create/:communityName', userPrivileges.ensureAuthenticated, upload.single("offer_image"), function(req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    var useCoin = false;
    if(req.body.offerPrice != null)
        useCoin = true;

    // Verifies if the form is completed
    req.checkBody('offerTitle', 'Título da oferta deverá ter entre 4 e 50 carácteres').isLength({min: 4, max: 50});
    req.checkBody('offerDescription', 'Descrição da oferta deverá ter entre 4 e 350 carácteres').isLength({min: 4, max: 350});
    if(useCoin){
        req.checkBody('offerPrice', 'Preço da oferta deverá ser um número entre 1 e 6 carácteres').isInt({min: 0, max: 999999});
    }

    var fileName = "";
    if(req.file) fileName = req.file.filename;

    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        res.redirect('/create_offer/' + communityName);
    } else {
        var priceValue = req.body.offerPrice;
        if(req.body.offerPrice == null){
            priceValue = 0;
        }

        // If no error is found a new offer will be created
        mongo.connect(configDB.url, function (err, db) {
            // Insert a new offer in the db
            offerController.insertOffer(db, req.user, communityName, req.body.offerTitle, req.body.offerDescription, priceValue,
                fileName, false, Date.now(), function (wasCreated) {
                    // Closes DB
                    db.close();

                    if(wasCreated){
                        req.flash('success_msg', 'Oferta criada com sucesso');
                        res.redirect('/community/' + communityName);
                    }else{
                        req.flash('error_msg', 'Não foi possível criar a oferta');
                        res.redirect('/community/' + communityName);
                    }
                });
            });
    }
});

module.exports = router;
