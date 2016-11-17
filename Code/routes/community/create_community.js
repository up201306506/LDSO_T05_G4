var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

router.get('/', userPrivileges.ensureAuthenticated, function (req, res) {
    res.render('community/create_community', {
        title: 'New Community',
        categoryList: dropdownList.categoryList,
        privacyList: dropdownList.privacyList
    });
});

router.post('/create', userPrivileges.ensureAuthenticated, function (req, res) {
    // Verifies if the form is completed
    req.checkBody('communityName', 'Nome da comunidade necessário').notEmpty();
    req.checkBody('headQuarter', 'Sede da comunidade necessária').notEmpty();
    req.checkBody('description', 'Descricao da comunidade necessária').notEmpty();

    // If an error is found an error message will be displayed
    var errors = req.validationErrors();
    if (errors) {
        res.render('community/create_community', {
            title: 'New Community',
            categoryList: dropdownList.categoryList,
            privacyList: dropdownList.privacyList,
            errors: errors
        });
    } else {
        // If no error is found a new community will be created
        mongo.connect(configDB.url, function (err, db, next) {
            // Insert a new community in the db
            communityController.insertCommunity(db, req.body.communityName, req.body.headQuarter, req.body.category,
                req.user, req.body.description, req.body.privacy, [req.user], function (wasCreated) {
                    db.close();

                    // The main page will be rendered
                    if (wasCreated)
                        req.flash('success_msg', 'Comunidade criada com sucesso');
                    else
                        req.flash('error_msg', 'Comunidade já existe');

                    res.redirect('/');
                });
        });
    }
});

module.exports = router;