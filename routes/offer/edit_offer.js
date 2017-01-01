var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

var multer  = require('multer');
var upload = multer({ dest: 'public/images/offers/' });

router.get('/:edit_offer', userPrivileges.ensureAuthenticated, function(req, res) {
    // GET offer id by url parameter
    var offerId = String(req.params.edit_offer);

    // Connects to db
    mongo.connect(configDB.url, function (err, db) {
        // Get this offer data
        offerController.getOfferData(db, offerId, function (offer) {
            // Get this offer community data
            communityController.getCommunityData(db, offer.communityName, function (community) {
                // Close DB
                db.close();

                res.render('offer/edit_offer',
                    {
                        title: 'Local Exchange - Editar Oferta',
                        communityName: offer.communityName,
                        username: offer.username,
                        offerId: offer._id,
                        offerTitle: offer.title,
                        offerDescription: offer.description,
                        offerPrice: offer.price,
                        offerImage: offer.imageDir,
                        useCoin: community.useCoin,
                        coinName: community.coinName,
                        lastURL: req.headers.referer
                    });
            });
        });
    });
});

router.post('/edit/:edit_offer', userPrivileges.ensureAuthenticated, upload.single("offer_image"), function(req, res) {
    // GET offer id by url parameter
    var offerId = String(req.params.edit_offer);

    var useCoin = false;
    if(req.body.offerPrice != null)
        useCoin = true;

    // Verifies if the form is completed
    req.checkBody('offerTitle', 'Título da oferta deverá ter entre 4 e 50 carácteres').isLength({min: 4, max: 50});
    req.checkBody('offerDescription', 'Descrição da oferta deverá ter entre 4 e 350 carácteres').isLength({min: 4, max: 350});
    if(useCoin){
        req.checkBody('offerPrice', 'Preço da oferta deverá ser um número entre 1 e 6 carácteres').isNumeric({min: 0, max: 999999});
    }

    var fileName = "";
    if(req.file) fileName = req.file.filename;

    var errors = req.validationErrors();
    var i,k=0;
    var cond=false;

    for(i=0;i<req.body.offerTitle.length;i++){
        k=req.body.offerTitle[i];
        k=k.keyCode;
        if(k == 8 || k == 33 || (k >= 35 && k <= 36) || (k >= 38 && k <= 59) || k == 61 || (k > 62 && k < 92) || k == 93 || (k > 94 && k < 123) || k == 126) {
            continue;
        } else {
            cond=true;
            break;
        }
    }

    if(cond==true) {
        req.flash('error_msg', 'Nome da oferta contém caracteres inválidos');
        res.redirect('/edit_offer/' + offerId);
    } else if (errors) {
        req.flash('errors', errors);
        res.redirect('/edit_offer/' + offerId);
    } else {
        // If no error is found a new offer will be created
        mongo.connect(configDB.url, function (err, db) {
            // Get this offer data
            offerController.getOfferData(db, offerId, function (offer) {
                // Edit this offer
                offerController.editOffer(db, offerId, offer.date, offer.username, offer.communityName, req.body.offerTitle,
                    req.body.offerDescription, req.body.offerPrice, fileName, function (wasEdited) {
                        // Closes DB
                        db.close();

                        if(wasEdited){
                            req.flash('success_msg', 'Oferta atualizada');
                            res.redirect('/community/' + offer.communityName);
                        }else{
                            req.flash('error_msg', 'Ocorreu um erro ao atualizar a oferta');
                            res.redirect('/community/' + offer.communityName);
                        }
                    });
            });
        });
    }
});

module.exports = router;

