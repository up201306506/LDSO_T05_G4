var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    communityController = require('./../../controllers/CommunityController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

/* GET community creation page. */
router.get('/:communityName', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Get commmunity info for the edit page placeholders
        communityController.getCommunityData(db, communityName, function (communityData) {
            db.close();

            // If this community does not exist in the tb
            if (communityData == null) {
                res.redirect('/');
            } else {
                res.render('community/edit_community',
                    {
                        communityName: communityName,
                        headQuartes: communityData.office,
                        description: communityData.description,
                        category: communityData.category,
                        privacy: communityData.privacy,
                        categoryList: dropdownList.categoryList,
                        privacyList: dropdownList.privacyList
                    });
            }
        });
    });
});

router.post('/:communityName/edit', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET community name from url
    var communityName = String(req.params.communityName);

    // Verifies if the form is completed
    req.checkBody('headQuarter', 'Sede da comunidade necessária').notEmpty();
    req.checkBody('description', 'Descricao da comunidade necessária').notEmpty();

    // If an error is found an error message will be displayed
    var errors = req.validationErrors();
    if (errors) {
        // Connects to the db
        mongo.connect(configDB.url, function (err, db) {
            // Get commmunity info for the edit page placeholders
            communityController.getCommunityData(db, communityName, function (communityData) {
                db.close();

                res.render('community/edit_community',
                    {
                        communityName: communityName,
                        headQuartes: communityData.office,
                        description: communityData.description,
                        category: communityData.category,
                        privacy: communityData.privacy,
                        categoryList: dropdownList.categoryList,
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
                req.body.selcategory, req.body.description, req.body.selprivacy, function () {
                    db.close();

                    req.flash('success_msg', 'Comunidade editada com sucesso');
                    res.redirect('/community/' + communityName);
                });
        });
    }
});

module.exports = router;