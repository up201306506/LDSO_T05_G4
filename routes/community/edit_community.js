var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Get commmunity info for the edit page placeholders
        communityController.getCommunityData(db, communityName, function (community) {
            // Close DB
            db.close();

            res.render('community/edit_community',
                {
                    communityName: communityName,
                    headQuartes: community.office,
                    description: community.description,
                    category: community.category,
                    privacy: community.privacy,
                    rules: community.ruleDescription,
                    useCoin: community.useCoin,
                    coinName: community.coinName,
                    privacy: community.privacy,
                    privacyList: dropdownList.privacyList
                });
        });
    });
});

router.post('/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Verifies if the form is completed
    req.checkBody('headQuarter', 'Sede da comunidade necessária').notEmpty();
    req.checkBody('description', 'Descricao da comunidade necessária').notEmpty();
    req.checkBody('privacy', 'É necessário escolher o tipo de privacidade').notEmpty();

    // If an error is found an error message will be displayed
    var errors = req.validationErrors();

    if(dropdownList.privacyList.indexOf(req.body.privacy) == -1){
        if(errors.constructor != Array) errors = [];
        errors.push({msg:'Tipo de visualização não válida'} );
    }

    if (errors) {
        // Connects to the db
        mongo.connect(configDB.url, function (err, db) {
            // Get commmunity info for the edit page placeholders
            communityController.getCommunityData(db, communityName, function (communityData) {
                // Close DB
                db.close();

                res.render('community/edit_community',
                    {
                        communityName: communityName,
                        headQuartes: communityData.office,
                        description: communityData.description,
                        category: communityData.category,
                        privacy: communityData.privacy,
                        rules: communityData.ruleDescription,
                        privacyList: dropdownList.privacyList,
                        errors: errors
                    });
            });
        });
    } else {
        // If no error is found the community will be edited
        mongo.connect(configDB.url, function (err, db, next) {
            // Edit the community info in the db
            communityController.editCommunityData(db, communityName, req.body.headQuarter,
                req.body.description, req.body.privacy, req.body.rules, function (wasEdited) {
                    // Close DB
                    db.close();

                    // If community was edited
                    if (wasEdited) {
                        req.flash('success_msg', 'Comunidade atualizada');
                        res.redirect('/community/' + communityName);
                    } else {
                        req.flash('error_msg', 'Ocorreu um erro ao atualizar a comunidade');
                        res.redirect('/edit_community/' + username);
                    }
                });
        });
    }
});

module.exports = router;