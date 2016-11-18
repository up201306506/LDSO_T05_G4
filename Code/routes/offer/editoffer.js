var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    /*req.checkBody('offer_name', 'Nome da oferta é necessário').notEmpty();
    req.checkBody('offer_description', 'É necessária uma decrição para a oferta').notEmpty();
    req.checkBody('offer_price', 'É necessário colocar um preço na oferta').notEmpty();*/

    res.render('offer/editoffer', { title: 'Local Exchange - Edit Offer' });
});

module.exports = router;

