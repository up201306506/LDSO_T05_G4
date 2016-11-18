var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {


    var fetched_type = "offer", message_type, tooltip;

    if(fetched_type == "conversation"){
        message_type = "user";
        tooltip = "Conversation";
    } else if(fetched_type == "offer") {
        message_type = "leaf"
        tooltip = "Offer Related";
    } else {
        message_type = "warning-sign"
        tooltip = "Unknown Message Type";
    }

    res.render('messaging/message', {
        title: 'Message from Another User',
        sender: "SenderUser",
        message_type: message_type,
        tooltip: tooltip,
        message_subject: "TEST SUBJECT TEST SUBJECT",
        message_content: "A MESSAGE A MESSAGE A MESSAGE A MESSAGE A MESSAGE A MESSAGE A MESSAGE A MESSAGE A MESSAGE ",
        sender_image: "/images/placeholder.jpg"
    });
});

module.exports = router;