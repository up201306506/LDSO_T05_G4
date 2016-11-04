/**
 * Created by João on 03/11/2016.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('main_page', { title: 'Local Exchange - Main page' });
});

module.exports = router;
