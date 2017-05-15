/**
 * Module dependencies.
 */
const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compress = require('compression');
const helpers = require('view-helpers');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const config = require('./config');

module.exports = function (app, passport, mongoose) {
  app.set('showStackError', true);

  //Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  //Setting the fav icon and static folder
  app.use(express.static(config.root + '/public'));

  //Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
  }

  //Set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  //Enable jsonp
  app.enable("jsonp callback");

  //cookieParser should be above session
  app.use(cookieParser());

  //bodyParser should be above methodOverride
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  //express/mongo session storage
  app.use(session({
    secret: config.secretKey,
    saveUninitialized: false,
    resave: true,
    store: new mongoStore({
      url: config.db,
      collection: 'sessions',
      mongoose_connection: mongoose.connection
    })
  }));

  //connect flash for flash messages
  app.use(flash());

  //dynamic helpers
  app.use(helpers(config.app.name));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function (err, req, res, next) {
    //Treat as 404
    if (~err.message.indexOf('not found')) return next();

    //Log it
    console.error(err.stack);

    //Error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

};
