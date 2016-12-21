var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges');

/* GET users listing. */
router.get('/:delete_offer', userPrivileges.ensureAuthenticated, function(req, res, next) {

    var offerId = String(req.params.delete_offer);

    mongo.connect(configDB.url, function (err, db, next) {

        offerController.deleteOffer(db, offerId, function (wasDeleted) {
                db.close();
                req.flash('success_msg', 'Oferta eliminada com sucesso');
                res.redirect('/');
            });
    });
});

module.exports = router;

