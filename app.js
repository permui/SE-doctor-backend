"use strict";

const express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  indexRouter = require('./routes/index'),
  apiRouter = require('./routes/api/mod'),
  mongoose = require('mongoose'),
  app = express();

// connect to MongoDB
// let uri = process.env.ME_CONFIG_MONGODB_URL;
// let options = {
//     user: process.env.ME_CONFIG_MONGODB_USERNAME,
//     pass: process.env.ME_CONFIG_MONGODB_PASSWORD,
// };

let uri = "mongodb://docker:yzhblind@yzhblind.top:27017";
let options = {
    dbName: "test2",
    user: "docker",
    pass: "yzhblind"
};
mongoose.connect(uri, options);
mongoose.connection.once('open', () => {
    console.log("MongoDB connection established.")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.disable("etag")

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser()); 
app.use(
    session({
        secret: "se2022",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
    error: err
    });
});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
res.status(err.status || 500);
res.render('error', {
    message: err.message,
    error: {}
});
});

module.exports = app;