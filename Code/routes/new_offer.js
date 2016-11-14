var express = require('express'),
    router = express.Router(),
    mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    configDB = require('./../config/database.js'),
    userPrivileges = require('./../config/userPrivileges'),
    offerController = require('../controllers/OfferController');

/* GET users listing. */
router.get('/', userPrivileges.ensureAuthenticated, function(req, res, next) {
    res.render('new_offer', { title: 'New Offer' });
});

router.post('/', function(req, res, next) {
    req.checkBody('offer_name', 'Nome da oferta é necessário').notEmpty();
    req.checkBody('offer_description', 'Username é necessário').notEmpty();
    req.checkBody('offer_price', 'Username é necessário').notEmpty();

    mongo.connect(configDB.url, function (err, db, next) {
        offerController.insertOffer(db, req.body.optradio, req.user, req.body.offer_description, false, Date.now(), req.body.offer_price, req.body.offer_name, req.body.offer_image,  function (result, id) {
            db.close();
            res.redirect('/viewoffer?id=' + id);
        });
    });
});

module.exports = router;
