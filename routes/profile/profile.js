var express = require('express'),
    router = express.Router(),
    configDB = require('./../../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../../controllers/UserController'),
    communityController = require('./../../controllers/CommunityController'),
    offerController = require('./../../controllers/OfferController'),
    userPrivileges = require('./../../config/userPrivileges'),
    dropdownList = require('./../../config/dropdownLists');

router.get('/:username', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET username from url
    var username = String(req.params.username);

    // Creates a var that indicates if this profile is this user profile
    var isOwnProfile = (username == req.user);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the user information
        userController.getUser(db, username, function (userData) {
            // Gets user enrolled communities
            communityController.getUserEnrolledCommunities(db, username, isOwnProfile, function (communitiesArr) {
                // Gets offers in inrolled communities
                    db.close();

                    res.render('profile/view',
                        {
                            title: 'Local Exchange - View Profile',
                            username: username,
                            isOwnProfile: isOwnProfile,
                            password: userData.password,
                            name: userData.name,
                            phone: userData.phone,
                            gender: userData.gender,
                            email: userData.email,
                            communityArr: communitiesArr
                        });
            });
        });
    });
});

router.get('/edit/:username', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET username from url
    var username = String(req.params.username);

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the user information
        userController.getUser(db, username, function (userData) {
            db.close();

            res.render('profile/edit',
                {
                    title: 'Local Exchange - View Profile',
                    userdata: userData,
                    username: username,
                    password: userData.password,
                    name: userData.name,
                    phone: userData.phone,
                    gender: userData.gender,
                    email: userData.email,
                    genderList: dropdownList.genderList
                });
        });
    });
});

router.post('/edit/:username', userPrivileges.ensureAuthenticated, function (req, res) {
    // GET username from url
    var username = String(req.params.username);

    // Verifies the form
    req.checkBody('password', 'Password é necessária').notEmpty();
    req.checkBody('password', 'Password deve ter entre 6 a 20 caracteres').len(6, 20);
    req.checkBody('passwordre', 'Passwords não coincidem').equals(req.body.password);
    req.checkBody('email', 'Email é necessário').notEmpty();
    req.checkBody('email', 'Email inválido').isEmail();
    req.checkBody('emailre', 'Emails não coincidem').equals(req.body.email);
    var errors = req.validationErrors();

    if(req.body.gender != '' && dropdownList.genderList.indexOf(req.body.gender) == -1){
        if(errors.constructor != Array) errors = [];
        errors.push({msg:'Género inválido'} );
    }

    if (errors) {
        req.flash('errors', errors);
        // If an error was found an error message will appear
        res.redirect('/profile/edit/' + username);
    } else {
        // Connects to the db
        mongo.connect(configDB.url, function (err, db) {
            // Edit the user information
            userController.editUser(db, username, req.body.password, req.body.name, req.body.email, req.body.phone, req.body.gender, function (wasEdited) {
                db.close();

                // If user was edited
                if (wasEdited) {
                    req.flash('success_msg', 'Perfil atualizado');
                    res.redirect('/profile/' + username);
                } else {
                    req.flash('error_msg', 'Ocorreu um erro ao atualizar o perfil');
                    res.redirect('/profile/edit/' + username);
                }
            });
        });
    }
});

module.exports = router;