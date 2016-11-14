var express = require('express'),
    router = express.Router();/*,
    mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    configDB = require('./../config/dbURL.js'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    user = require('../models/user');*/

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('search_results', { title: 'Local Exchange - Search_Results' });
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