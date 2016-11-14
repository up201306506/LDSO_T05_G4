var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userController = require('./../controllers/UserController');

router.get('/', function (req, res) {
    res.render('login', {title: 'Local Exchange - Login'});
});

router.post('/register', function (req, res) {

    // Verifies if the form is completed correctly
    req.checkBody('username', 'Username é necessário').notEmpty();
    req.checkBody('username', 'Username deve ter entre 4 a 20 caracteres').len(4, 20);
    req.checkBody('password', 'Password é necessária').notEmpty();
    req.checkBody('password', 'Password deve ter entre 6 a 20 caracteres').len(6, 20);
    req.checkBody('password2', 'Passwords não coincidem').equals(req.body.password);
    req.checkBody('email', 'Email é necessário').notEmpty();
    req.checkBody('email', 'Email inválido').isEmail();
    req.checkBody('email2', 'Emails não coincidem').equals(req.body.email);

    // Verifies if there is any error
    var errors = req.validationErrors();
    if (errors) {
        // If an error was found an error message will appear
        res.render('login', {
            title: 'Local Exchange - Login',
            errors: errors
        });
    } else {
        // If no error was found the new user will be inserted in the db
        mongo.connect(configDB.url, function (err, db, next) {
            userController.insertUser(db, "", req.body.username, req.body.email, req.body.password, "", "", "");
        });

        // Redirects to the exact same page to complete login
        req.flash('success_msg', 'Registado com sucesso');
        res.redirect('/');
    }
});


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        mongo.connect(configDB.url, function (err, db) {
            userController.logIn(db, username, password, function (err, user) {
                if (err) {
                    console.log(err);
                } else if (user) {
                    return done(null, user.username);
                } else {
                    return done(null, false, {message: 'Credenciais inválidas'});
                }

                db.close();
            });
        });
    }
));

router.post('/', function (req, res, next) {
    // Verifies if the login form was completed
    req.checkBody('username', 'Username é necessário').notEmpty();
    req.checkBody('password', 'Password é necessária').notEmpty();

    // Verifies if the login form was completed correctly
    var errors = req.validationErrors();
    if (errors) {
        // If there is any error an error message will appear
        res.render('login', {
            title: 'Local Exchange - Login',
            errors: errors
        });
    } else {
        // If no error was found the user will be redirected to the main page of the website
        next();
    }
}, passport.authenticate(
    'local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        session: true
    }
));

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

module.exports = router;