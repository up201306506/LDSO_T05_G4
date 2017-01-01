var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

router.get('/:delete_offer', userPrivileges.ensureAuthenticated, function(req, res) {
    // GET offer id by url parameter
    var offerId = String(req.params.delete_offer);

    // Connects to db
    mongo.connect(configDB.url, function (err, db) {
        // Deletes offer from db
        offerController.removeOffer(db, offerId, function () {
            // Close DB
            db.close();

            req.flash('success_msg', 'Oferta eliminada com sucesso');
            res.redirect(req.headers.referer);
        });
    });
});

module.exports = router;

