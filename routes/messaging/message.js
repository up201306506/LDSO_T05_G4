var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userPrivileges = require('./../../config/userPrivileges'),
    messagingController = require("./../../controllers/MessageController.js");

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

    if (errors) {
        // If an error was found an error message should appear
        console.log(errors);

        //Redirect
        req.flash('errors', errors);
        res.redirect('/message/inbox');
    } else {

        // If no error is found a new message will be sent
        console.log(req.body);

        //MESSAGE CREATION
        mongo.connect(configDB.url, function (err, db) {
            // function (db, sender, receiver, subject, content, date, type, callback)
            messagingController.insertMessage(db, req.user, req.body.receiver, req.body.subject, req.body.content, new Date(), req.body.type, function(success){
                db.close();

                if(success)
                    req.flash('success_msg', 'Mensagem enviada!');
                else
                    req.flash('error_msg', 'O remetente "'+ req.body.receiver+'" não existe!');
                res.redirect('/message/inbox');
            } );
        });
    }
});

//TODO: Needs a flash warning about unknown or non permitted message ID
router.get('/id/', userPrivileges.ensureAuthenticated, function(req, res) {
    res.redirect('/inbox');
});

router.get('/inbox/markAllRead', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db){
        messagingController.setAllMessageAsRead(db, req.user, function(result) {
            db.close();
            res.redirect('/message/inbox');
        });
    });
});

router.get('/delete/:id', userPrivileges.ensureAuthenticated, function (req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db){
        messagingController.getMessageByID(db, id, function(data){

            //Redirection Checks
            if(data == null){
                //TODO: Needs warning about unknown message ID
                res.redirect('/message/inbox');
                return;
            }
            if(req.user != data.receiver) {
                console.log("ACESS: redirecting " + req.user + " for attempting to delete message belonging to "+ data.receiver)
                res.redirect('/message/inbox');
                return;
            }

            messagingController.setMessageAsDeleted(db,id, function(result){
                db.close();
                res.redirect('/message/inbox');
            });
        });
    });
});

router.get('/undelete/:id', userPrivileges.ensureAuthenticated, function (req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db){
        messagingController.getMessageByID(db, id, function(data){

            //Redirection Checks
            if(data == null){
                //TODO: Needs warning about unknown message ID
                res.redirect('/message/inbox');
                return;
            }
            if(req.user != data.receiver) {
                console.log("ACESS: redirecting " + req.user + " for attempting to undelete message belonging to "+ data.receiver)
                res.redirect('/message/inbox');
                return;
            }

            messagingController.setMessageAsUndeleted(db,id, function(result){
                db.close();
                res.redirect('/message/inbox');
            });
        });
    });
});

router.get('/star/:id', userPrivileges.ensureAuthenticated, function (req, res) {// Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db){
        messagingController.getMessageByID(db, id, function(data){

            //Redirection Checks
            if(data == null){
                //TODO: Needs warning about unknown message ID
                res.sendStatus(400);
                return;
            }
            if(req.user != data.receiver) {
                res.sendStatus(403);
                return;
            }

            messagingController.toggleMessageStarred(db,id,true,function(result){
                db.close();
                res.sendStatus(200);
            });
        });
    });
});

router.get('/unstar/:id', userPrivileges.ensureAuthenticated, function (req, res) {// Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db){
        messagingController.getMessageByID(db, id, function(data){

            //Redirection Checks
            if(data == null){
                //TODO: Needs warning about unknown message ID
                res.sendStatus(400);
                return;
            }
            if(req.user != data.receiver) {
                res.sendStatus(403);
                return;
            }

            messagingController.toggleMessageStarred(db,id,false,function(result){
                db.close();
                res.sendStatus(200);
            });
        });
    });
});

//TODO: User Images
//TODO: A "Back to Inbox" button
router.get('/id/:id', userPrivileges.ensureAuthenticated, function(req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessageByID(db, id, function(data){

            //Redirection Checks
            if(data == null){
                //TODO: warning about unknown message ID
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
                    message_id: id,
                    sender: data.sender,
                    receiver: data.receiver,
                    messageReceiver: true,
                    message_type: message_type,
                    tooltip: tooltip,
                    date: data.date,
                    message_subject: data.subject,
                    message_content: data.content,
                    deleted: data.deleted,
                    sender_image: "/images/placeholder.jpg"
                });

            });
        });
    });
});

router.get('/sent/:id', userPrivileges.ensureAuthenticated, function(req, res) {
    // Get id from url
    var id = req.params.id;

    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessageByID(db, id, function(data){
            db.close();

            //Redirection Checks
            if(data == null){
                //TODO: warning about unknown message ID
                res.redirect('/message/inbox');
                return;
            }
            if(req.user != data.sender) {
                console.log("ACESS: redirecting " + req.user + " for attempting to see message belonging to "+ data.sender)
                res.redirect('/message/inbox');
                return;
            }

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
                message_id: id,
                sender: data.sender,
                receiver: data.receiver,
                messageReceiver: false,
                message_type: message_type,
                date: data.date,
                tooltip: tooltip,
                message_subject: data.subject,
                message_content: data.content,
                deleted: data.deleted,
                sender_image: "/images/placeholder.jpg"
            });

        });
    });
});

//TODO: Message preview should show escaped text, no format tags
router.get('/inbox', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, req.user, function(userMessages){
            db.close();

            var messages_per_page = 10;

            var page = 1;
            if(!isNaN(parseFloat(req.query.pagina)) && isFinite(req.query.pagina))
                page = req.query.pagina;
            var maxPage = Math.ceil( userMessages.length/messages_per_page );

            if(maxPage < 1) maxPage = 1;
            if(page < 1) page = 1;
            if(page > maxPage) page = maxPage;

            var newMessages = false;
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

                if(!userMessages[i].read){
                    newMessages =true;
                }
            }

            if(page == maxPage)
                userMessages = userMessages.slice((page-1)*messages_per_page, userMessages.length);
            else
                userMessages = userMessages.slice((page-1)*messages_per_page,(page-1)*messages_per_page + messages_per_page);

            res.render('messaging/inbox',
                {
                    title: 'Message Inbox',
                    userMessages: userMessages,
                    inboxType: 'Inbox',
                    newMessages : newMessages,
                    page: page,
                    maxPage: maxPage

                }
            );
        });
    });
});

router.get('/offers', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, req.user, function(data){

            var newMessages = false;
            for(var i = 0; i < data.length; i++){

                if(!data[i].read){
                    newMessages =true;
                }
            }
            messagingController.getMessagesByUserByType(db, req.user, "offer", function(userMessages){
                db.close();
                var messages_per_page = 10;

                var page = 1;
                if(!isNaN(parseFloat(req.query.pagina)) && isFinite(req.query.pagina))
                    page = req.query.pagina;
                var maxPage = Math.ceil( userMessages.length/messages_per_page );

                if(maxPage < 1) maxPage = 1;
                if(page < 1) page = 1;
                if(page > maxPage) page = maxPage;


                for(var i = 0; i < userMessages.length; i++){
                    userMessages[i].type = "leaf";
                    userMessages[i].typePopup = "Offer Related";
                }

                if(page == maxPage)
                    userMessages = userMessages.slice((page-1)*messages_per_page, userMessages.length);
                else
                    userMessages = userMessages.slice((page-1)*messages_per_page,(page-1)*messages_per_page + messages_per_page);

                res.render('messaging/inbox',
                    {
                        title: 'Message Inbox',
                        userMessages: userMessages,
                        inboxType: 'Offers',
                        newMessages : newMessages,
                        page: page,
                        maxPage: maxPage
                    }
                );
            });
        });
    });
});

router.get('/starred', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, req.user, function(data){
            var newMessages = false;
            for(var i = 0; i < data.length; i++) {

                if (!data[i].read) {
                    newMessages = true;
                }
            }

            messagingController.getStarredUserMessages(db, req.user, function(userMessages){
                db.close();
                var messages_per_page = 10;

                var page = 1;
                if(!isNaN(parseFloat(req.query.pagina)) && isFinite(req.query.pagina))
                    page = req.query.pagina;
                var maxPage = Math.ceil( userMessages.length/messages_per_page );

                if(maxPage < 1) maxPage = 1;
                if(page < 1) page = 1;
                if(page > maxPage) page = maxPage;

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

                if(page == maxPage)
                    userMessages = userMessages.slice((page-1)*messages_per_page, userMessages.length);
                else
                    userMessages = userMessages.slice((page-1)*messages_per_page,(page-1)*messages_per_page + messages_per_page);

                res.render('messaging/inbox',
                    {
                        title: 'Message Inbox',
                        userMessages: userMessages,
                        inboxType: 'Important',
                        newMessages : newMessages,
                        page: page,
                        maxPage: maxPage
                    }
                );
            });
        });
    });
});

router.get('/sent', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, req.user, function(data){
            var newMessages = false;
            for(var i = 0; i < data.length; i++) {

                if (!data[i].read) {
                    newMessages = true;
                }
            }
            messagingController.getSentByUser(db, req.user, function(userMessages){

                var messages_per_page = 10;

                var page = 1;
                if(!isNaN(parseFloat(req.query.pagina)) && isFinite(req.query.pagina))
                    page = req.query.pagina;
                var maxPage = Math.ceil( userMessages.length/messages_per_page );

                if(maxPage < 1) maxPage = 1;
                if(page < 1) page = 1;
                if(page > maxPage) page = maxPage;

                db.close();
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

                if(page == maxPage)
                    userMessages = userMessages.slice((page-1)*messages_per_page, userMessages.length);
                else
                    userMessages = userMessages.slice((page-1)*messages_per_page,(page-1)*messages_per_page + messages_per_page);

                res.render('messaging/inbox',
                    {
                        title: 'Message Inbox',
                        userMessages: userMessages,
                        inboxType: 'Sent',
                        newMessages : newMessages,
                        page: page,
                        maxPage: maxPage
                    });
            });
        });
    });
});

router.get('/deleted', userPrivileges.ensureAuthenticated, function (req, res) {
    mongo.connect(configDB.url, function (err, db) {
        messagingController.getMessagesByUser(db, req.user, function(data){
            var newMessages = false;
            for(var i = 0; i < data.length; i++) {

                if (!data[i].read) {
                    newMessages = true;
                }
            }
            messagingController.getMessagesByUserDeleted(db, req.user, function(userMessages){
                db.close();

                var messages_per_page = 10;

                var page = 1;
                if(!isNaN(parseFloat(req.query.pagina)) && isFinite(req.query.pagina))
                    page = req.query.pagina;
                var maxPage = Math.ceil( userMessages.length/messages_per_page );

                if(maxPage < 1) maxPage = 1;
                if(page < 1) page = 1;
                if(page > maxPage) page = maxPage;


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

                if(page == maxPage)
                    userMessages = userMessages.slice((page-1)*messages_per_page, userMessages.length);
                else
                    userMessages = userMessages.slice((page-1)*messages_per_page,(page-1)*messages_per_page + messages_per_page);

                res.render('messaging/inbox',
                    {
                        title: 'Message Inbox',
                        userMessages: userMessages,
                        inboxType: 'Deleted',
                        newMessages : newMessages,
                        page: page,
                        maxPage: maxPage
                    }
                );
            });
        });
    });
});


module.exports = router;