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
    res.locals.errors = req.flash('errors');
    res.locals.user = req.user || null;
    next();
});

//---------------------------------------------------------------------

// web pages js's
// unspecified
var webpage_login = require('./routes/login');
var webpage_faq = require('./routes/faq');
var webpage_mainpage = require('./routes/main_page');
var webpage_searchresults = require('./routes/search_results');
var webpage_mycommunities = require('./routes/community/my_communities');
// profile
var webpage_profile = require('./routes/profile/profile');
// community
var webpage_communitypage = require('./routes/community/community_page');
var webpage_createCommunity = require('./routes/community/create_community');
var webpage_editCommunity = require('./routes/community/edit_community');
var webpage_communityUserList = require('./routes/community/community_user_list');
var webpage_communityOfferList = require('./routes/community/community_offer_list');
var webpage_accept_requests = require('./routes/community/accept_requests');
var webpage_deleteCommunity = require('./routes/community/remove_community');
// offer
var webpage_createOffer = require('./routes/offer/create_offer');
var webpage_editoffer = require('./routes/offer/edit_offer');
var webpage_deleteoffer = require('./routes/offer/delete_offer');
var webpage_acceptoffer = require('./routes/offer/accept_offer');
// messaging
var controller_message = require('./routes/messaging/message');

// pages url's
// unspecified
app.use('/login', webpage_login);
app.use('/faq', webpage_faq);
app.use('/', webpage_mainpage);
app.use('/search_results', webpage_searchresults);
app.use('/my_communities', webpage_mycommunities);
// profile
app.use('/profile', webpage_profile);
// community
app.use('/community', webpage_communitypage);
app.use('/create_community', webpage_createCommunity);
app.use('/edit_community', webpage_editCommunity);
app.use('/community_users', webpage_communityUserList);
app.use('/community_offers', webpage_communityOfferList);
app.use('/accept_requests', webpage_accept_requests);
app.use('/delete_community', webpage_deleteCommunity);
// offer
app.use('/create_offer', webpage_createOffer);
app.use('/edit_offer', webpage_editoffer);
app.use('/delete_offer', webpage_deleteoffer);
app.use('/accept_offer', webpage_acceptoffer);
// messaging
app.use('/message/', controller_message);

//---------------------------------------------------------------------

// catch 404
app.use(function (req, res) {
    res.render('error', {
        error: '404 Page Not Found'
    });
});

module.exports = app;