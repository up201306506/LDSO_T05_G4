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

    var useCoin = false;
    if(req.body.useCoin === 'on')
        useCoin = true;

    // Verifies if the form is completed
    req.checkBody('headQuarter', 'Sede da comunidade deverá ter entre 4 e 50 carácteres').isLength({min: 4, max: 50});
    req.checkBody('description', 'Descricao da comunidade deverá ter até 800 carácteres').isLength({min: 1, max: 800});
    if(useCoin) {
        req.checkBody('coinName', 'Nome da moeda da comunidade deverá ter entre 1 e 10 carácteres').isLength({min: 1, max: 10});
    }
    req.checkBody('privacy', 'É necessário escolher o tipo de privacidade').notEmpty();
    req.checkBody('rules', 'Regras da comunidade deverá ter até 800 carácteres').isLength({min: 1, max: 800});

    // If an error is found an error message will be displayed
    var errors = req.validationErrors();

    if(dropdownList.privacyList.indexOf(req.body.privacy) == -1){
        if(errors.constructor != Array) errors = [];
        errors.push({msg:'Tipo de visualização não válida'} );
    }

    var i,k=0;
    var cond=false;

    for(i=0;i<req.body.communityName.length;i++){
        k=req.body.communityName[i];
        k=k.keyCode;
        if(k == 8 || k == 33 || (k >= 35 && k <= 36) || (k >= 38 && k <= 59) || k == 61 || (k > 62 && k < 92) || k == 93 || (k > 94 && k < 123) || k == 126) {
            continue;
        } else {
            cond=true;
            break;
        }
    }

    if(cond==true) {
        req.flash('error_msg', 'Nome da comunidade contém caracteres inválidos');
        res.redirect('/edit_community/' + communityName);
    } else if (errors) {
        req.flash('errors', errors);
        res.redirect('/edit_community/' + communityName);
    } else {
        // If no error is found the community will be edited
        mongo.connect(configDB.url, function (err, db) {
            // Edit the community info in the db
            communityController.editCommunityData(db, communityName, req.body.headQuarter,
                req.body.description, req.body.coinName, req.body.privacy, req.body.rules, function (wasEdited) {
                    // Close DB
                    db.close();

                    // If community was edited
                    if (wasEdited) {
                        req.flash('success_msg', 'Comunidade atualizada');
                        res.redirect('/community/' + communityName);
                    } else {
                        req.flash('error_msg', 'Ocorreu um erro ao atualizar a comunidade');
                        res.redirect('/edit_community/' + communityName);
                    }
                });
        });
    }
});

module.exports = router;