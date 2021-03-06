/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const authTypes = ['github', 'twitter', 'facebook', 'google'];
// const jwt = require('jsonwebtoken');


/**
 * User Schema
 */


const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  username: String,
  provider: String,
  avatar: String,
  premium: Number, // null or 0 for non-donors, 1 for everyone else (for now)
  donations: [],
  hashedPassword: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {}
});


// Virtuals
UserSchema.virtual('password').set(function (password) {
  this._password = password;
  this.hashedPassword = this.encryptPassword(password);
}).get(function () {
  return this._password;
});


const validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('name').validate(function (name) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashedPassword').validate(function (hashedPassword) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) { return next(); }

  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
    return next(new Error('Invalid password'));
  }

  next();
});

/**
 * Methods
 */

UserSchema.methods = {

  authenticate(plainText) {
    if (!plainText || !this.hashedPassword) {
      return false;
    }
    return bcrypt.compareSync(plainText, this.hashedPassword);
  },


  encryptPassword(password) {
    if (!password) return '';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
};

mongoose.model('User', UserSchema);
