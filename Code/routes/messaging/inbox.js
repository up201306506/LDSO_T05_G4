var express = require('express');
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    messagingController = require("./../../controllers/MessageController.js"),
    mongo = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
    res.render('messaging/inbox', { title: 'Message Inbox' });
});

router.get('/test_create_message', function(req, res){
    mongo.connect(configDB.url, function (err, db, next) {
        messagingController.insertMessage(db, "UserTest1", "UserTest2", "TestSubject", "OLA!!!", "2016-05-26T05:00:00.000Z", "TestType", function(success){
            db.close();
            if (success)
                req.flash('success_msg', 'Nova Mensagem Inserida!');
            else
                req.flash('error_msg', 'Mensagem não inserida');
            console.log(success);
            res.render("test", {title: "create_message", content1 : success, content2 : "", content3 : "", content4 : "" })
        } );

    });
});

module.exports = router;