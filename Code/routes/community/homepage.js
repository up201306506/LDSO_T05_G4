var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('community/homepage', { title: 'Community Homepage' });
});

module.exports = router;