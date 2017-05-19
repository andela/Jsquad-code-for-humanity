
const mongoose = require('mongoose');
const avatars = require('./avatars').all();
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const secretKey = process.env.SECRET_TOKEN_KEY;

// Auth callback
exports.authCallback = function (req, res) {
  res.redirect('/chooseavatars');
};

// Show login form
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

// exports.loginWithFacebook = function (req, res, socialProvider) {
//   socialProvider.setFbKey({ appId: 'YOUR FACEBOOK APP ID', apiVersion: 'API VERSION" });
// };

// Show sign up form

exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

// Logout

exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

// Session
exports.session = function (req, res) {
  res.redirect('/');
};

// Check avatar - Confirm if the user who logged in via passport already has an avatar.

exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec(function (err, user) {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

// Create user

exports.create = function (req, res, next) {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec(function (err, existingUser) {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save(function (err) {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user
            });
          }
          req.logIn(user, function (err) {
            if (err) return next(err);
            return res.redirect('/#!/');
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

// Assign avatar to user

exports.avatars = function (req, res) {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec(function (err, user) {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = function (req, res) {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec(function (err, user) {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i += 1) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            // console.log('Validated donation');
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

// Show profile
exports.show = function (req, res) {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

// Send User

exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

// Find user by id

exports.user = function (req, res, next, id) {
  User.findOne({ _id: id })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};

exports.signupWithEmail = function (req, res) {
  // get the user credentials from form  req.body.password
  // req.body.email
  User
    .findOne({ email: req.body.email })
    .then((existingUser, err) => {
      if (err) throw err;
      if (existingUser) {
        return res.json({ message: 'A user with this email address already exists' });
      }

      const token = jwt.sign(existingUser._id, secretKey, {
        expiresIn: '24h'
      });

      existingUser.password = null;
      res.status(200).json(Object.assign({}, existingUser._doc, { token }));
    });
};


exports.loginWithEmail = function (req, res) {
  // get the user credentials from form  req.body.password
  // req.body.email
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.authenticate(req.body.password)) {
        return res.status(403).json({
          message: 'Invalid password'
        });
      }

      const token = jwt.sign(user._id, secretKey, {
        expiresIn: '24h'
      });

      user.password = null;
      res.status(200).json(Object.assign({}, user._doc, { token }));
    })
    .catch(error => res.status(400).json(error));
};
