var express = require('express');
var router = express.Router();
var assert = require('assert');
var auth = require("../config/ensureAuthentication.js");


/* GET home page. */
router.get('/', auth.ensureAuthenticated, function (req, res) {
    req.flash('error_msg', 'É necessário estar autenticado');
    res.render('index', {title: 'Local Exchange'});
});

module.exports = router;