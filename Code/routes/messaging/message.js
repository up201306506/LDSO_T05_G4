var express = require('express');
var router = express.Router();
configDB = require('./../../config/dbURL.js'),
    messagingController = require("./../../controllers/MessageController.js"),
    mongo = require('mongodb').MongoClient;

router.get('/', function(req, res) {
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

router.get('/test/:id', function(req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessageByID(db, id, function(data){
            db.close();
            console.log(data);

            if(data == null)
                res.redirect('/');
            else
            {
                var message_type, tooltip;

                if(data.type == "conversation"){
                    message_type = "user";
                    tooltip = "Conversation";
                } else if(data.type == "offer") {
                    message_type = "leaf"
                    tooltip = "Offer Related";
                } else {
                    message_type = "warning-sign"
                    tooltip = "Unknown Message Type";
                }

                res.render('messaging/message', {
                    title: 'Personal Message',
                    sender: data.sender,
                    message_type: message_type,
                    tooltip: tooltip,
                    message_subject: data.subject,
                    message_content: data.content,
                    sender_image: "/images/placeholder.jpg"
                });
            }
        });
    });
});

router.get('/test_create', function(req, res){
    mongo.connect(configDB.url, function (err, db) {
        messagingController.insertMessage(db, "UserTest1", "zzzzzzzz", "TestSubject", "OLA!!!", "2016-05-26T05:00:00.000Z", "TestType", function(success){
            db.close();
            console.log(success.ops);
            res.render("test", {title: "test_create", content1: success.ops })
        } );
    });
});
router.get('/test_get_name', function(req, res){
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, "zzzzzzzz", function(success_fetch){
            db.close();

            console.log(success_fetch);

            res.render("test", {title: "test_get_name", content1: success_fetch })
        });
    });
});
router.get('/test_get_id/:id', function(req, res){
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessageByID(db, id, function(success_fetch){
            db.close();
            console.log(success_fetch);
            if(success_fetch == null)
                res.render("test", {title: "test_get_id", content1: "There was no content in the database for that id OR the id is invalid" })
            else
                res.render("test", {title: "test_get_id", content1: success_fetch })
        });
    });
});


module.exports = router;