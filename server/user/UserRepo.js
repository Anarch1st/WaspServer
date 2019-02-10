const {
  Client
} = require('pg');
const fs = require('fs');
const path = require('path');
const User = require('./User');

const debug = require('debug')('auth:user:repo');

class UserRepo {
  constructor(params) {
    this.client = new Client({
      user: (process.env.NODE_ENV === 'production') ? 'pi' : 'saii',
      host: 'localhost',
      database: 'pi_db',
      password: 'pi_db_pass',
      port: 5432
    });
    this.client.connect();
    let sql = fs.readFileSync(path.join(__dirname, './user.sql')).toString();

    this.client.query(sql).then(res => {
      debug('user.sql ran successfully');
    }).catch(err => {
      debug('Error orrured while running user.sql \n %O', err);
    })
  }

  // NOTE: All db queries return Promise
  addUser(user) {
    let insertQuery = {
      name: 'insert-user',
      text: 'INSERT INTO users(username, password, permissions) VALUES($1, $2, $3)',
      values: [user.username, user.password, user.permissions]
    }
    debug('Adding user: %s', user.username);
    return this.client.query(insertQuery);
  }

  updateUser(user) {
    let updateQuery = {
      name: 'update-user',
      text: 'UPDATE users SET username = $1, password = $2, permissions = $3 WHERE id = $4 AND is_deleted = FALSE',
      values: [user.username, user.password, user.permissions, user.id]
    }
    debug('Updating user: %s', user.id);
    return this.client.query(updateQuery);
  }

  deleteUser(userId) {
    let updateQuery = {
      name: 'delete-user',
      text: 'UPDATE users SET is_deleted = TRUE WHERE id = $1',
      values: [userId]
    }
    debug('Deleting user: %s', userId);
    return this.client.query(updateQuery);
  }

  queryUserByName(username) {
    let searchQuery = {
      name: 'search-user-name',
      text: 'SELECT id, username, password, permissions FROM users WHERE is_deleted = FALSE AND username = $1 LIMIT 1',
      values: [username]
    }
    debug('Querying for user %s', username);
    return this.client.query(searchQuery);
  }

  queryUserById(id) {
    let searchQuery = {
      name: 'search-user-id',
      text: 'SELECT id, username, password, permissions FROM users WHERE id = $1 LIMIT 1',
      values: [id]
    }
    debug('Querying for user %s', id);
    return this.client.query(searchQuery);
  }
}

module.exports = UserRepo;