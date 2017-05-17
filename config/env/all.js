const path = require('path'),
  rootPath = path.normalize(`${__dirname}/../..`);

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  db: process.env.DATABASE_URL,
  firebase_apiKey: process.env.FIREBASE_APIKEY,
  firebase_authDomain: process.env.FIREBASE_AUTHDOMAIN,
  firebase_databaseUrl: process.env.FIREBASE_DATABASEURL,
  firebase_projectId: process.env.FIREBASE_PROJECTID,
  firebase_storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  firebase_messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
};
