var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

/* GET users listing. */
router.get('/:accept_offer', userPrivileges.ensureAuthenticated, function(req, res, next) {

    var offerId = String(req.params.accept_offer);

    mongo.connect(configDB.url, function (err, db, next) {

        offerController.updateOfferStatus(db, offerId, req.user, true, function (wasAccepted) {
            db.close();
            req.flash('success_msg', 'Oferta aceite com sucesso');
            res.redirect('/');
        });
    });
});

module.exports = router;

