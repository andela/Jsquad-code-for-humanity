var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');
var keys = rootPath + '/keys.txt';

module.exports = {
	root: rootPath,
	port: process.env.PORT || 9000,
	db: process.env.DATABASE_URL
};
