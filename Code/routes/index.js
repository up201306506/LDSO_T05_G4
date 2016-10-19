var express = require('express');
var router = express.Router();
var assert = require('assert');


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res) {
    req.flash('error_msg', 'É necessário estar autenticado');
    res.render('index', {title: 'Local Exchange'});
});

module.exports = router;