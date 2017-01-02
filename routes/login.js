var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    configDB = require('./../config/dbURL.js'),
    mongo = require('mongodb').MongoClient,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userController = require('./../controllers/UserController');

router.get('/', function (req, res) {
    if(req.isAuthenticated()){
        res.redirect('/');
    }else{
        res.render('login', {title: 'Local Exchange - Login'});
    }
});

router.post('/register', function (req, res) {

    // Verifies if the form is completed correctly
    req.checkBody('username', 'Username deve ter entre 4 a 20 caracteres').isLength({min: 4, max: 20});
    req.checkBody('password', 'Password deve ter entre 6 a 20 caracteres').isLength({min: 6, max: 20});
    req.checkBody('passwordre', 'Passwords não coincidem').equals(req.body.password);
    req.checkBody('email', 'Email é necessário').notEmpty();
    req.checkBody('email', 'Email inválido').isEmail();
    req.checkBody('emailre', 'Emails não coincidem').equals(req.body.email);

    // Verifies if there is any error
    var errors = req.validationErrors();
    var i,k=0;
    var cond=false;

    for(i=0;i<req.body.username.length;i++){
        k=req.body.username[i];
        k=k.charCodeAt(0);
        if((k >= 48 && k <= 57) || (k >= 65 && k <= 90) || (k >= 97 && k <= 122)) {
            continue;
        } else {
            cond=true;
            break;
        }
    }

    if(cond==true) {
        req.flash('error_msg', 'Username contém caracteres inválidos');
        res.redirect('/login');
    } else if (errors) {
        req.flash('errors', errors);
        res.redirect('/login');
    } else {
        // Connects to the db
        mongo.connect(configDB.url, function (err, db) {
            // Insert new user in the db
            userController.insertUser(db, req.body.username, req.body.password, "", req.body.email, "", "", function (error) {
                // Close DB
                db.close();

                // The login page will be rendered
                if(!error){
                    req.flash('success_msg', 'Registado com sucesso');
                    res.redirect('/login');
                }else{
                    req.flash('error_msg', error);
                    res.redirect('/login');
                }
            });
        });
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
            if(err){
                console.log(err);
                return done(null, false, {message: 'Base de dados inacessivel'});
            }

            userController.logIn(db, username, password, function (err, user) {
                db.close();

                if (err) {
                    console.log(err);
                } else if (user) {
                    return done(null, user.username);
                } else {
                    return done(null, false, {message: 'Credenciais inválidas'});
                }
            });
        });
    }
));

router.post('/', function (req, res, next) {
    // Verifies if the login form was completed
    req.checkBody('username', 'Username é necessário').notEmpty();
    req.checkBody('password', 'Password é necessária').notEmpty();

    // Connects to the db
    mongo.connect(configDB.url, function (err, db) {
        // Gets the user data
        userController.getUser(db, req.body.username, function (userinfo) {
            // Closes DB
            db.close();

            // If username was not found in the db or the password is incorrect
            if(!userinfo) {
                req.flash('error_msg', 'Username não existente');
            } else if(userinfo.password != req.body.password) {
                req.flash('error_msg', 'Password incorrecta');
            }
        });
    });

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