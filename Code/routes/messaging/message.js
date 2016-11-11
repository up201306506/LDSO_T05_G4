var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('messaging/message', { title: 'Message from ??????' });
});

module.exports = router;