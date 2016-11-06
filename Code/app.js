var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var expressValidator = require('express-validator');

// web app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// settings
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public'))); // set static folder

//Express Session
app.use(session({
    secret: 'ldsoSecret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//Connect flash
app.use(flash());

//Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//---------------------------------------------------------------------

// web pages js's
// initial pages
var webpage_login = require('./routes/login');
var webpage_faq = require('./routes/faq');
// profile pages
var webpage_mainpage = require('./routes/main_page');
var webpage_profile = require('./routes/profile');
// community pages
var webpage_newcommunity = require('./routes/create_community');
var webpage_communityUserList = require('./routes/community_user_list');
var webpage_newoffer = require('./routes/new_offer');
var webpage_viewoffer = require('./routes/viewoffer');
// search page
var webpage_searchresults = require('./routes/search_results');

// declaration of the web pages
// initial pages
app.use('/', webpage_login);
app.use('/faq', webpage_faq);
// profile pages
app.use('/main_page', webpage_mainpage);
app.use('/profile', webpage_profile);
// community pages
app.use('/newcommunity', webpage_newcommunity);
app.use('/community_users', webpage_communityUserList);
app.use('/newoffer', webpage_newoffer);
app.use('/viewoffer', webpage_viewoffer);
// search page
app.use('/search_results', webpage_searchresults);

//---------------------------------------------------------------------

// catch 404
app.use(function (req, res, next) {
    res.render('error', {
        error: '404 Page Not Found'
    });
});

module.exports = app;