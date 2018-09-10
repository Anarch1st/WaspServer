const path = require('path');
const jsonfile = require('jsonfile');
const crypto = require('crypto');

const usersFile = path.resolve(__dirname, "../db/user-db.json");
const sha512 = crypto.createHash('sha512');
const md5 = crypto.createHash('md5');

function authenticate(username, password) {
	console.log(username);
	jsonfile.readFile(usersFile, function(err, obj) {
		for(var i=0;i<obj.length;i++) {
			if (obj[i].username === username) {
				sha512.update(password);
				md5.update(sha512.digest('hex'));
				console.log(md5.digest('hex'));

				if (md5.digest('hex') === password) {
					return obj[i];
				} else {
					return -1;
				}
			}
		}
		return null;
	});
}

function findByUsername(username, cb) {
	jsonfile.readFile(usersFile, function(err, obj) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].username === username) {
				cb(obj[i]);
			}
		}
		cb(null);
	});
}

function findById(id, cb) {
	jsonfile.readFile(usersFile, function(err, obj) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id === id) {
				cb(obj[i]);
			}
		}
	});
}
module.exports.authenticate = authenticate;
module.exports.findByUsername = findByUsername;
module.exports.findById = findById;
