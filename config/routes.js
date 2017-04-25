const async = require('async');
const express = require('express');
const UserSchema = require('../app/models/user');
const jwt = require('jsonwebtoken');
const index = require('../app/controllers/index');
const answers = require('../app/controllers/answers');
const questions = require('../app/controllers/questions');
const avatars = require('../app/controllers/avatars');
const users = require('../app/controllers/users');
const mongoose = require('mongoose'),
  User = mongoose.model('User');
// const dev = require('../config/development');
const port = process.env.PORT || 3000;

module.exports = function (app, passport, auth) {
  //User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

  //Setting up the users api
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);

  // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Finish with setting up the userId param
  app.param('userId', users.user);


  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes

  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  app.get('/avatars', avatars.allJSON);

  //Home route

  app.get('/play', index.play);
  app.get('/', index.render);

  // app.get('/show', function (req, res) {
  //   res.send('Hello! The API is at http://localhost:' + port + '/api');
  // });


  // const apiRoute = express.Router();

  // apiRoute.get('/xxx', function (req, res) {
  //   res.json({ message: 'Welcome to the coolest API on earth!' });
  // });


  app.post('/api/authenticate', users.loginWithEmail);
  // apiRoute.post('/authenticate', function (res, req) {
  //   //   // exports.loginWithEmail = function (req, res) {
  //   //   //   get the user credentials from form  req.body.password
  //   //   //    req.body.email
  //   //   //   console.log(req.body);
  // User
  //   .findOne({
  //     email: req.body.email
  //   }, function (user) {
  //     // compare the password
  //     if (!user) {
  //       res.json({ success: false, message: 'authentication failed' });
  //     } else {
  //       if (user.authenticate(req.body.password)) {
  //         console.log('nate');

  //         var token = jwt.sign(user, app.get('my_secret'), {
  //           expiresInMinutes: 1400
  //         });
  //         console.log('waiyaki');
  //         res.json({
  //           success: true,
  //           token
  //         });
  //       } else {
  //         res.json({ success: false, message: 'authentication failed' });
  //       }
  //     }
  //   });
  // });
  // app.use('/api', apiRoute);
};
