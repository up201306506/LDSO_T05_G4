var express = require('express');
var router = express.Router();
var assert = require('assert');

/* GET community creation page. */
router.get('/', function (req, res) {
    res.render('create_community', {title: 'New Community'});
});


module.exports = router;