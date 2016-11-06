var express = require('express');
var router = express.Router();
var assert = require('assert');


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/');
    }
}

/* View profile */
router.get('/', ensureAuthenticated, function (req, res) {
    req.flash('error_msg', 'É necessário estar autenticado');
    res.render('profile/view', {title: 'Local Exchange'});
});

/* Get Edit Profile page */
router.get('/edit', ensureAuthenticated, function (req, res) {
    req.flash('error_msg', 'É necessário estar autenticado');
    res.render('profile/edit', {title: 'Local Exchange'});
});

module.exports = router;