var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userPrivileges = require('./../../config/userPrivileges'),
    messagingController = require("./../../controllers/MessageController.js");

//
//Finished Webpages
//
router.get('/', userPrivileges.ensureAuthenticated, function(req, res) {
    res.redirect('/message/inbox');
});
router.post('/new', userPrivileges.ensureAuthenticated, function(req, res) {
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

    //TODO: Needs warning about unknown or non permitted message ID
router.get('/id/', userPrivileges.ensureAuthenticated, function(req, res) {
    res.redirect('/inbox');s
});
router.get('/inbox/markAllRead', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db){
        messagingController.setAllMessageAsRead(db, req.user, function(result) {
            db.close();
            console.log("TEST");
            res.redirect('/message/inbox');
        });
    });
});


//
// Very incomplete implementations that still need a lot of work done
//
    //TODO: User Images
    //TODO: Navigation buttons? "Back", "Next and Previous Messages"
    //TODO: Several modal forms - finish the inbox one properly first
router.get('/id/:id', userPrivileges.ensureAuthenticated, function(req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessageByID(db, id, function(data){

            //Redirection Checks
            if(data == null){
                //!!!! Needs warning about unknown message ID
                res.redirect('/message/inbox');
                return;
            }
            if(req.user != data.receiver) {
                console.log("ACESS: redirecting " + req.user + " for attempting to see message belonging to "+ data.receiver)
                res.redirect('/message/inbox');
                return;
            }

            messagingController.setMessageAsRead(db,id, function(result){
                db.close();

                //console.log(data);
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

            });
        });
    });
});

    //TODO: Message preview should show escaped text, no format tags
    //TODO: Make message deleting button work.
    //TODO: Make message starring button work.
    //TODO: Convert dates to something nice to look at.
router.get('/inbox', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, req.user, function(userMessages){
            db.close();
            console.log(userMessages);

            for(var i = 0; i < userMessages.length; i++){
                if(userMessages[i].type == "conversation"){
                    userMessages[i].type = "user";
                    userMessages[i].typePopup = "Conversation";
                }
                else if(userMessages[i].type.type == "offer"){
                    userMessages[i].type = "leaf";
                    userMessages[i].typePopup = "Offer Related";
                }
                else{
                    userMessages[i].type = "warning-sign";
                    userMessages[i].typePopup = "System Notification";
                }
            }

            res.render('messaging/inbox',
                {
                    title: 'Message Inbox',
                    userMessages: userMessages,
                    inboxType: 'Inbox'
                }
            );
        });
    });

});

    //TODO: Missing pages
        //TODO: Request page for "reading", "deleting" and "starring" a message
        //TODO: The other inbox tabs, as separate pages - literally the same as regular inbox except with different fetch result save for the sent mail one with the message links (see below)
        //TODO: Page for "sent" mail, shows contents but doesn't let you delete or redirect it, and has Receiver opposed to Sender

    // TODO: Styling - Make this look like the rest of the site


//
// TESTS
//

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