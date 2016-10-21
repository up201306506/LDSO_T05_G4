var express = require('express');
var router = express.Router();
var assert = require('assert');
var auth = require("../config/ensureAuthentication.js");

/* GET community creation page. */
router.get('/', /*auth.ensureAuthenticated,*/ function (req, res) {
    req.flash('error_msg', 'É necessário estar autenticado');
    res.render('create_community', {title: 'New Community'});
});


module.exports = router;