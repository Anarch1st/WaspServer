const path = require('path');
const jsonfile = require('jsonfile');
const crypto = require('crypto');

const usersFile = path.resolve(__dirname, "../db/user-db.json");

function findByUsername(username, password, done) {
	jsonfile.readFile(usersFile, function(err, obj) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].username === username) {
				if (verifyPassword(obj[i], password)) {
					return done(null, obj[i]);
				} else {
					return done(null, false, {message: "Incorrect Password"});
				}
			}
		}
		return done(null, false, {message: "User not found"});
	});
}

function verifyPassword(user, password) {
	const sha512 = crypto.createHash('sha512');
	const md5 = crypto.createHash('md5');

	const s1 = sha512.update(password).digest('hex');
	const s2 = md5.update(s1).digest('hex');

	return s2===user.password;
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

module.exports.findByUsername = findByUsername;
module.exports.findById = findById;
