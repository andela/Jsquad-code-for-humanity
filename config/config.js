const all = require(__dirname + '/../config/env/all.js');
const configJson = require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.json') || {};

module.exports = Object.assign(all, configJson);