var express = require('express'),
    router = express.Router(),
    mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    configDB = require('./../config/database.js'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    user = require('../models/user');

/* GET page. */
router.get('/', function (req, res) {
    res.render('login', {title: 'Local Exchange - Login'});
});

router.post('/register', function (req, res) {
    req.checkBody('username', 'Username é necessário').notEmpty();
    req.checkBody('username', 'Username deve ter entre 4 a 20 caracteres').len(4, 20);
    req.checkBody('password', 'Password é necessária').notEmpty();
    req.checkBody('username', 'Password deve ter entre 6 a 20 caracteres').len(6, 20);
    req.checkBody('password2','Passwords não coincidem').equals(req.body.password);
    req.checkBody('email', 'Email é necessário').notEmpty();
    req.checkBody('email', 'Email inválido').isEmail();
    req.checkBody('email2','Emails não coincidem').equals(req.body.email);

    var errors = req.validationErrors();
    if (errors) {
        console.log("Erros SIM");
        res.render('login', {
            title: 'Local Exchange - Login',
            errors: errors
        });
    } else {
        var itemToRegister = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };

        mongo.connect(configDB.url, function (err, db, next) {
            assert.equal(null, err);
            db.collection('users').insertOne(itemToRegister, function (err, result) {
                assert.equal(null, err);
                db.close();
            })
        });

        /*var newUser = new User({
         username: req.body.username,
         password: req.body.password,
         email: req.body.email
         });

         User.createUser(newUser, function (err, user) {
         if(err) throw err;
         console.log(user);
         });*/

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
            assert.equal(null, err);
            db.collection('users').findOne({username: username, password: password}, function (err, user) {
                if (err) {
                    console.log(err);
                }
                else if (user) {
                    return done(null, user.username);
                }
                else {
                    return done(null, false, {message: 'Credenciais inválidas'});
                }
                db.close();
            });
        });
    }
));

router.post('/', function (req, res, next) {
        req.checkBody('username', 'Username é necessário').notEmpty();
        req.checkBody('password', 'Password é necessária').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            console.log("Erros SIM");
            res.render('login', {
                title: 'Local Exchange - Login',
                errors: errors
            });
        } else {
            next();
            /*mongo.connect(configDB.url, function (err, db) {
                assert.equal(null, err);
                db.collection('users').findOne({
                    username: req.body.username,
                    password: req.body.password
                }, function (err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else if (user) {
                        res.redirect('/');
                    }
                    else {
                        console.log('Invalid');
                        res.redirect('');
                        //TODO mostrar erro
                    }
                    db.close();
                });
            });*/
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

module.exports = router;