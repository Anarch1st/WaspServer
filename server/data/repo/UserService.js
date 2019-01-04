const path = require('path');
const jsonfile = require('jsonfile');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const User = require('./User');
const usersFile = path.resolve(__dirname, "../db/user-db.json");

class UserService {

  static findByUsername(username, password, done) {
    jsonfile.readFile(usersFile, function(err, obj) {
      let users = User.getUsersList(obj.users);
      for (let user of users) {
        if (user.username === username) {
          if (bcrypt.compareSync(password, user.password)) {
            return done(null, user);
          } else {
            console.log("false");
            return done(null, false, {
              message: "Incorrect"
            });
          }
        }
      }

      return done(null, false, {
        message: "User not found"
      });
    });
  }

  static addUser(username, password, roles) {
    jsonfile.readFile(usersFile, (err, obj) => {
      let users = User.getUsersList(obj.users);

      bcrypt.hash(password, 14, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }

        users.push(new User({
          id: uuid(),
          username: username,
          password: hash,
          roles: roles
        }));

        jsonfile.writeFile(usersFile, {
          users: users
        }, (err) => {
          console.error(err);
        });
      })
    })
  }

  static findById(id, cb) {
    jsonfile.readFile(usersFile, function(err, obj) {
      let users = User.getUsersList(obj.users);
      for (let user of users) {
        if (user.id === id) {
          cb(user)
        }
      }
    });
  }
}

module.exports = UserService;