var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    userPrivileges = require('./../config/userPrivileges');

/* GET users listing. */
router.get('/', userPrivileges.ensureAuthenticated, function(req, res, next) {

    // TEMP
    var tempArr = [
        {
            name: 'Companhia'
        },
        {
            name: 'Companhia'
        }
    ];

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
        },
        {
            communityName: 'Comunidade',
            offerName: 'Oferta',
            offerDescription: 'BLAH BLAH BLAH blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
        }
    ];

    res.render('main_page',
        {
            title: 'Local Exchange - Main page',
            communityArr: tempArr,
            offerArr: tempOfferArr
        });
});

module.exports = router;