const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./User');
const UserRepo = require('./UserRepo');
const Cache = require("../cache/Cache");

const debug = require('debug')('auth:user:service');

const userCache = new Cache({
  ttl: 1000 * 60 * 15, //15 min
});

const userRepo = new UserRepo();

class UserService {

  findByUsername(username, cb) {
    userRepo.queryUserByName(username)
      .then((res) => {
        if (res.rows && res.rows[0] && Object.keys(res.rows[0]).length > 0) {
          let user = new User(res.rows[0]);
          debug('User Found %O', user);
          userCache.set(user.id, user);
          cb(null, user);
        } else {
          debug('No user found');
          cb('No such user', null);
        }
      })
      .catch((err) => {
        debug('User queryByName error: %O', err)
        cb('Error', null);
      });
  }

  addUser(username, password, permissions) {
    bcrypt.hash(password, 14, (err, hash) => {
      if (err) {
        console.error(err);
        return;
      }
      userRepo.addUser({
          username: username,
          password: hash,
          permissions: permissions
        }).then(res => {
          debug('User Added')
        })
        .catch((err) => {
          debug('User addition error: %O', err);
          console.error(err);
        });

    })
  }

  // NOTE: Users are cached by their ids intune with the session storing userId
  findById(id, cb) {
    let cachedUser = userCache.get(id);
    if (cachedUser) {
      cb(null, cachedUser);
      debug('User cache hit');
      return;
    }

    debug('User cache miss');
    userRepo.queryUserById(id)
      .then((res) => {
        if (res.rows && res.rows[0] && Object.keys(res.rows).length > 0) {
          let user = new User(res.rows[0]);
          debug('User found by id');
          userCache.set(user.id, user);
          cb(null, user);
        } else {
          debug('No user found');
          cb('No such user', null);
        }
      })
      .catch((err) => {
        debug('User queryById error: %O', err);
        cb('Error', null);
      });
  }

  updateUser(user) {
    userRepo.updateUser(user).then(res => {
      debug('User updated')
    }).catch((err) => {
      debug('User update error: %O', err);
    });
  }

  logoutUser(id) {
    let cachedUser = userCache.get(id);
    if (cachedUser) {
      userCache.delete(id);
      debug('User deleted from cache');
      return;
    }
  }
}

module.exports = UserService;