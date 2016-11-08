var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('messaging/inbox', { title: 'Message Inbox' });
});

module.exports = router;