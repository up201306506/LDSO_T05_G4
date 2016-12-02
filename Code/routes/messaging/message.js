var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    messagingController = require("./../../controllers/MessageController.js");
//
//Incomplete URL Redirections
//
router.get('/', function(req, res) {
    res.redirect('/message/inbox');
});
router.get('/id/', function(req, res) {
    //!!!! Needs warning about unknown message ID
    res.redirect('/');
});

//
//Finished Webpage Templates - To be replaced with functional pages
//
router.get('/inbox', function(req, res) {
    res.render('messaging/inbox', { title: 'Message Inbox' });
});
router.get('/message', function(req, res) {
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
        title: 'A TEMPLATE FOR VIEWING MESSAGES',
        sender: "SenderUser",
        message_type: message_type,
        tooltip: tooltip,
        message_subject: "TEST SUBJECT TEST SUBJECT",
        message_content: "YOU ARE VIEWING A TEMPLATE. HEAD OVER TO /message/test/(id) TO VIEW DATABASE MESSAGES",
        sender_image: "/images/placeholder.jpg"
    });
});


//
//Finished Webpages
//

router.post('/new', function(req, res) {
    // Verifies if the form is completed
    req.checkBody('receiver', 'Por Favor indique um remetente para a mensagem').notEmpty();
    req.checkBody('subject', 'Por Favor indique um tema para a mensagem').notEmpty();
    req.checkBody('type', 'A mensagem tem de ter um tipo').notEmpty();
    req.checkBody('content', 'A mensagem tem de ter um conteudo').notEmpty();
    var errors = req.validationErrors();

    //User not logged in???
    if(req.user == undefined){
        if(errors.constructor != Array) errors = [];
        errors.push({msg:'Houve um problema em encontrar o teu ID de utilizador'} );
    }

    /*
        TODO:
            Verificar se existe o utilizador remetente

     */


    if (errors) {
        // If an error was found an error message should appear
        console.log("!!!!!!!! Message NOT Created")
        console.log(errors);

        //Redirect
        req.flash('errors', errors);
        res.redirect('/message/inbox');
    } else {

        // If no error is found a new message will be sent
        console.log("!!!!!!!! Message Created")
        console.log(req.body);

        //MESSAGE CREATION
        mongo.connect(configDB.url, function (err, db) {
            // function (db, sender, receiver, subject, content, date, type, callback)
            messagingController.insertMessage(db, req.user, req.body.receiver, req.body.subject, req.body.content, new Date(), req.body.type, function(success){
                db.close();

                req.flash('success_msg', 'Mensagem enviada!');
                res.redirect('/message/inbox');
            } );
        });
    }
});

//
// TESTS and half done implementations - I will delete as soon as they find their proper place
//

    //Should become /id/:id and replace the /message template completely
router.get('/test/:id', function(req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessageByID(db, id, function(data){
            db.close();
            //console.log(data);

            if(data == null){
                //!!!! Needs warning about unknown message ID
                res.redirect('/message/inbox');
            }
            else if(req.user != data.receiver) {
                console.log("ACESS: redirecting " + req.user + " for attempting to see message belonging to "+ data.receiver)
                res.redirect('/message/inbox');

                return;
            }
            else {
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
    //Should replace /inbox later
router.get('/test_inbox', function (req, res) {
    res.render('messaging/inbox', { title: 'Message Inbox' });
});

router.get('/test_create', function(req, res){
    mongo.connect(configDB.url, function (err, db) {
        messagingController.insertMessage(db, "xxxxxxxx", "zzzzzzzz", "TestSubject", "OLA!!!", "2016-05-26T05:00:00.000Z", "TestType", function(success){
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