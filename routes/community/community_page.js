var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    messagingController = require('./../../controllers/MessageController'),
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

router.get('/:communityName', function (req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Verifies the page the user is in
        var page = req.query.page;
        if(!page){
            page = 1;
        }

        //Range
        var pageSize = 10;
        var range = {from:(pageSize*(page-1)), size:pageSize};

        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Get this community offers
            offerController.getCommunityOffers(db, communityName, range, function (offers, totalOffersCount) {
                // Closes db
                db.close();

                // Verifies if user is logged
                var isLogged = false;
                if(req.user)
                    isLogged = true;

                // Verifies if this user is a community member
                var isMemberBool = false;
                if(isLogged){
                    for(var i = 0; i < community.members.length; i++){
                        if(community.members[i].name === req.user){
                            isMemberBool = true;
                            break;
                        }
                    }
                }

                // Verifies if this user already requested to be member
                var isPendentRequestBool = false;
                if(community.requests.indexOf(req.user) != -1)
                    isPendentRequestBool = true;

                // Gets this user community permissions
                var isModeratorBool = false;
                if(community.admins.indexOf(req.user) != -1)
                    isModeratorBool = true;

                // Holds community privacy
                var isPrivateCommunity = false;
                if(community.privacy == dropdownList.privacyList[1])
                    isPrivateCommunity = true;
                var isSecretCommunity = false;
                if(community.privacy == dropdownList.privacyList[2])
                    isSecretCommunity = true;

                // Renders page
                res.render('community/community_page',
                    {
                        username: req.user,
                        communityName: community.name,
                        communityOffice: community.office,
                        communityDescription: community.description,
                        communityRules: community.ruleDescription,
                        useCoin: community.useCoin,
                        coinName: community.coinName,
                        privacy: community.privacy,
                        admins: community.admins,
                        members: community.members,
                        offerArr: offers,
                        isLogged: isLogged,
                        isMember: isMemberBool,
                        isPending: isPendentRequestBool,
                        isMod: isModeratorBool,
                        isPrivate: isPrivateCommunity,
                        isSecret: isSecretCommunity,
                        nPages: Math.ceil(totalOffersCount/2),
                        thisPage: page,
                        user: req.user
                    });
            });
        });
    });
});

router.get('/:communityName/join_community/', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the info from the community
        communityController.getCommunityData(db, communityName, function (community) {
            // Verifies community privacy
            if(community.privacy == dropdownList.privacyList[0]){ // Public community
                // Inserts the user
                communityController.insertUserInCommunity(db, communityName, req.user, function () {
                    // Closes db
                    db.close();

                    // Redirects page
                    req.flash('success_msg', 'Aderiu à comunidade ' + communityName);
                    res.redirect("/community/" + communityName);
                });
            } else if(community.privacy == dropdownList.privacyList[1]) { // Private community
                // Inserts the user's request
                communityController.insertUserRequestsInCommunity(db, communityName, req.user, function () {
                    // Closes db
                    db.close();

                    // Redirects page
                    req.flash('success_msg', 'Pedido de adesão à comunidade ' + communityName + ' enviado com sucesso');
                    res.redirect("/community/" + communityName);
                });
            }
        });
    });
});

router.get('/:communityName/abandon_community/', userPrivileges.ensureAuthenticated, function (req, res, next) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Removes user from community
        communityController.removeUserFromCommunity(db, communityName, req.user, function () {
            // Closes db
            db.close();

            req.flash('success_msg', 'Abandou a comunidade ' + communityName);
            res.redirect("/");
        });
    });
});

router.post('/invitation', userPrivileges.ensureAuthenticated, function(req, res) {

    // Verifies if the form is completed
    req.checkBody('recipient', 'Tem de indicar um utilizador a quem enviar convite ').notEmpty();
    req.checkBody('content', 'Por favor escreva uma mensagem junto com o seu convite').notEmpty();
    req.checkBody('community', '_community_id?').notEmpty();
    var errors = req.validationErrors();


    //User not logged in???
    if(req.user == undefined){
        if(errors.constructor != Array) errors = [];
        errors.push({msg:'Houve um problema em encontrar o teu ID de utilizador'} );
    }

    if (errors) {
        // If an error was found an error message should appear
        req.flash('errors', errors);
        //Redirect
        var backURL=req.header('Referer') || '/';
        res.redirect(backURL);
        return;
    }

     mongo.connect(configDB.url, function (err, db) {
         var subject = "Foi convidado a juntar-se à comunidade "+ req.body.community;

         var message = "Foi convidado por <a href='./profile/"+ req.user +"'>"+req.user+"</a> a juntar-se à comunidade <a href='./community/"+req.body.community+"'>"+req.body.community+ "</a>. <br>Junto com este convite foi enviada a seguinte mensagem pessoal:<br>";
         message += "<blockquote>" +req.body.content + "</blockquote>";
         message += "Se quiser aceitar o convite, clique <a href='./community/"+req.body.community+"'>neste endereço</a> para entrar.<br>";
         message += "Se não quiser aceitar o convite, pode ignorar ou apagar esta mensagem";


         messagingController.insertMessage(db, req.user, req.body.recipient, subject, message, new Date(), 'invitation', function(success){
             db.close();

             if(success)
             req.flash('success_msg', 'Convite enviado a '+ req.body.recipient +'!');
             else
             req.flash('error_msg', 'O utilizador "'+ req.body.recipient+'" não existe!');

             var backURL=req.header('Referer') || '/';
             res.redirect(backURL);
         });
     });
});

module.exports = router;