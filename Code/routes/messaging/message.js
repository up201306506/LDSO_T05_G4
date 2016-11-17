var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    res.render('messaging/message', {
        title: 'Message from Another User',
        sender: "SenderUser",
        message_subject: "TEST SUBJECT TEST SUBJECT",
        message_content: "TEST TEST TEST TEST TEST TEST TEST",
        sender_image: "/images/placeholder.jpg"
    });
});

module.exports = router;