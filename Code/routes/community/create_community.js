var express = require('express');
var router = express.Router();
var configDB = require('./../../config/dbURL.js');
var communityController = require('../../controllers/CommunityController');
var mongo = require('mongodb').MongoClient;
var userController = require('../../controllers/UserController');
var userPrivileges = require('./../../config/userPrivileges');

/* GET community creation page. */
router.get('/', function (req, res) {
    res.render('community/create_community', {title: 'New Community'});
});

router.post('/create', userPrivileges.ensureAuthenticated, function (req,res) {
    req.checkBody('nome', 'Nome da comunidade necessário').notEmpty();
    req.checkBody('sede', 'Sede da comunidade necessária').notEmpty();
    req.checkBody('descricao', 'Descricao da comunidade necessária').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        console.log("Erros SIM");
        res.render('community/create_community', {
            title: 'New Community',
            errors: errors
        });
    } else {
        mongo.connect(configDB.url, function (err, db, next) {
            userController.getUser(db, req.user, function (err, userdata) {
                communityController.insertCommunity(db, req.body.nome, req.body.sede, req.body.categoria,
                    userdata.email, req.body.descricao, req.body.visualizacao, [userdata.email], function () {
                    db.close();
                });
            });
        });

        req.flash('success_msg', 'Comunidade criada com sucesso');
        res.redirect('/');
    }
});

module.exports = router;