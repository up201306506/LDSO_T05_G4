var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('viewoffer', { title: 'Local Exchange - View Offer' });
});

module.exports = router;

