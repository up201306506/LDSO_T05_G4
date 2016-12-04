var express = require('express'),
    router = express.Router(),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    userController = require('./../controllers/UserController'),
    communityController = require('./../controllers/CommunityController'),
    userPrivileges = require('./../config/userPrivileges');

router.post('/search', userPrivileges.ensureAuthenticated, function (req, res) {

    mongo.connect(configDB.url, function (err, db) {

        req.checkBody('search','Nada para procurar').notEmpty();

        var errors = req.validationErrors();
        console.log(req.body.search);
        if(!errors)
        {
            communityController.getPublicAndPrivateCommunity(db, req.body.search, function (communities) {
                console.log(communities);
                db.close();
                if (communities == null) {
                    res.redirect('/');
                } else {
                    res.render('search_results',
                        {
                            title: 'Local Exchange - Search_Results',
                            communities: communities
                        });
                }
            });
        }
    });



    //res.render('search_results', { title: 'Local Exchange - Search_Results' });
});

    /*mongo.connect(configDB.url, function (err, db) {
        assert.equal(null, err);
        db.collection('community').findOne({username: username, password: password}, function (err, user) {
            if (err) {
                console.log(err);
            }
            else if (user) {
                return done(null, user.username);
            }
            else {
                return done(null, false, {message: 'Credenciais inválidas'});
            }
            db.close();
        });
    });*/

module.exports = router;