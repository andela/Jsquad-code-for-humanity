const express = require('express');
const fs = require('fs');
const join = require('path');
const passport = require('passport');
const logger = require('mean-logger');
const io = require('socket.io');

const auth = require('./server/middlewares/authorization');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();

/**
 * Main application entry file.```
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./server/config');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models

const modelsPath = join.join(__dirname, '/server/models');

const walk = function (path) {
  return fs.readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

walk(modelsPath);

// express settings
require('./server/express')(app, passport, mongoose);
require('./server/passport')(passport);
require('./server/routes')(app, passport, auth);

// Start the app by listening on <port>
const server = app.listen(config.port);
const ioObj = io.listen(server, { log: false });

// game logic handled here

require('./server/socket/socket')(ioObj);

console.log(`Express app started on port ${config.port}`);

// Initializing logger

logger.init(app, passport, mongoose);

// expose app

module.exports = app;
