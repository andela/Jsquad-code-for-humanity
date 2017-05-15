const all = require(__dirname + '/../server/env/all.js');
const configJson = require(__dirname + '/../server/env/' + process.env.NODE_ENV + '.json') || {};

module.exports = Object.assign(all, configJson);