var express = require('express');
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    messagingController = require("./../../controllers/MessageController.js"),
    mongo = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
    res.render('messaging/inbox', { title: 'Message Inbox' });
});



module.exports = router;