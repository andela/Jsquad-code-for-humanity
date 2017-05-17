const currentEnv = 'NODE_ENV' in process.env ? process.env.NODE_ENV : 'development';
const all = require(`${__dirname}/../config/env/all.js`);
const configJson = require(`${__dirname}/../config/env/${currentEnv}.json`) || {};

module.exports = Object.assign(all, configJson);
