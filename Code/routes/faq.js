var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('faq', { title: 'Local Exchange - FAQ' });
});

module.exports = router;