var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// web app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// settings
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// web pages js's
var index = require('./routes/index');

// declaration of the web pages
app.use('/', index);

// catch 404
app.use(function (req, res, next) {
    res.render('error', {
        error: '404 Page Not Found'
    });
});

module.exports = app;