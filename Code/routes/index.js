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

    var resultArray = [];
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var cursor = db.collection('users').find();
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function () {
            db.close();
        });
    });

    console.log(resultArray);

    res.redirect('/');
});

module.exports = router;