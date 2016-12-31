var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

router.get('/', userPrivileges.ensureAuthenticated, function (req, res) {
    res.render('community/create_community', {
        title: 'Local Exchange - Nova Comunidade',
        privacyList: dropdownList.privacyList
    });
});

router.post('/create', userPrivileges.ensureAuthenticated, function (req, res) {
    var useCoin = false;
    if(req.body.useCoin === 'on')
        useCoin = true;

    // Verifies if the form is completed
    req.checkBody('communityName', 'Nome da comunidade deverá ter entre 4 e 50 carácteres').isLength({min: 4, max: 50});
    req.checkBody('headQuarter', 'Sede da comunidade deverá ter entre 4 e 50 carácteres').isLength({min: 4, max: 50});
    req.checkBody('description', 'Descricao da comunidade deverá ter até 800 carácteres').isLength({min: 1, max: 800});
    if(useCoin) {
        req.checkBody('coinName', 'Nome da moeda da comunidade deverá ter entre 1 e 10 carácteres').isLength({min: 1, max: 10});
    }
    req.checkBody('privacy', 'É necessário escolher o tipo de privacidade').notEmpty();
    req.checkBody('rules', 'Regras da comunidade deverá ter até 800 carácteres').isLength({min: 1, max: 800});

    var errors = req.validationErrors();

    if(dropdownList.privacyList.indexOf(req.body.privacy) == -1){
        if(errors.constructor != Array) errors = [];
        errors.push({msg:'Tipo de visualização não válida'} );
    }

    if (errors) {
        res.render('community/create_community', {
            title: 'Local Exchange - Nova Comunidade',
            privacyList: dropdownList.privacyList,
            errors: errors
        });
    } else {
        // If no error is found a new community will be created
        mongo.connect(configDB.url, function (err, db, next) {
            // Insert a new community in the db
            communityController.insertCommunity(db, req.body.communityName, req.body.headQuarter, req.body.description,
                useCoin, req.body.coinName, req.body.privacy, req.body.rules, req.user, [req.user], [{name: req.user, coins: 0}] ,function (wasCreated) {
                    db.close();

                    // The main page will be rendered
                    if (wasCreated){
                        req.flash('success_msg', 'Comunidade criada com sucesso');
                        res.redirect('/');
                    } else {
                        req.flash('error_msg', 'Comunidade já existente');
                        res.redirect('/');
                    }
                });
        });
    }
});

module.exports = router;