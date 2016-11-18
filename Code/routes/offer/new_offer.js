var express = require('express'),
    router = express.Router(),
    mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    configDB = require('./../../config/dbURL.js'),
    userPrivileges = require('./../../config/userPrivileges'),
    offerController = require('../../controllers/OfferController');
var multer  = require('multer');
var upload = multer({ dest: 'temp/images/offer/' });

/* GET users listing. */
router.get('/', userPrivileges.ensureAuthenticated, function(req, res, next) {
    res.render('offer/new_offer', { title: 'New Offer' });
});

router.post('/', upload.single("offer_image"), function(req, res, next) {
    req.checkBody('offer_name', 'Nome da oferta é necessário').notEmpty();
    req.checkBody('offer_description', 'É necessária uma decrição para a oferta').notEmpty();
    req.checkBody('offer_price', 'É necessário colocar um preço na oferta').notEmpty();

    var fileName = "";
    if(req.file) fileName = req.file.filename;

    mongo.connect(configDB.url, function (err, db, next) {
        offerController.insertOffer(db, req.body.optradio, req.user, req.body.offer_description, false, Date.now(), req.body.offer_price, req.body.offer_name, fileName,  function (result, id) {
            db.close();
            req.flash('success_msg', 'Oferta criada com sucesso');
            res.redirect('/viewoffer?id=' + id);
        });
    });
});

module.exports = router;
