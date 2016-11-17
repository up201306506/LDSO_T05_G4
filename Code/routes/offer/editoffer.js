var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('offer/editoffer', { title: 'Local Exchange - Edit Offer' });
});

module.exports = router;

