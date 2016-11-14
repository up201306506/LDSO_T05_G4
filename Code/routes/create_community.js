var express = require('express');
var router = express.Router();
var assert = require('assert');
var configDB = require('./../config/database.js');
var communityController = require('../controllers/CommunityController');
var mongo = require('mongodb').MongoClient;

/* GET community creation page. */
router.get('/', function (req, res) {
    res.render('community/create_community', {title: 'New Community'});
});

var getDateTime = function () {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

router.post('/create', function (req,res)
{
    var user_data;

    if(req.isAuthenticated())
        user_data = req.user;

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
            communityController.insertCommunity(db, req.body.nome, req.body.sede, req.body.categoria, user_data, req.body.descricao, req.body.visualizacao, getDateTime(),[user_data], function () {
                db.close();
            });
        });

        req.flash('success_msg', 'Comunidade criada com sucesso');
        res.redirect('/');
    }
})

module.exports = router;