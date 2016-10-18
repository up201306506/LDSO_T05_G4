var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Local Exchange'});
});

router.post('/register', function (req, res, next) {

    var itemToRegister = {
        username: req.body.username,
        password: req.body.password
    };

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('users').insertOne(itemToRegister, function (err, result) {
            assert.equal(null, err);
            db.close();
        })
    });

    res.redirect('/');
});

router.post('/login', function (req, res, next) {

    var usernameReceived = req.body.name;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);

        db.collection('users').findOne({"username": usernameReceived}, function (err, itemFromDB) {
            assert.equal(null, err);

            console.log("User Received: " + usernameReceived);
            console.log("DB: " + itemFromDB.username + ", " + itemFromDB.password);

            db.close();
        });
    });

    res.redirect('/');
});

module.exports = router;