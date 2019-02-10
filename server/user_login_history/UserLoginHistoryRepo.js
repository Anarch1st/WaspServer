const {
  Client
} = require('pg');
const fs = require('fs');
const path = require('path');

class UserLoginHistoryRepo {
  constructor(params) {
    this.client = new Client({
      user: (process.env.NODE_ENV === 'production') ? 'pi' : 'saii',
      host: 'localhost',
      database: 'pi_db',
      password: 'pi_db_pass',
      port: 5432
    });
    this.client.connect();
    let sql = fs.readFileSync(path.join(__dirname, '../db/user_login_history.sql')).toString();
    this.client.query(sql, (err, res) => {
      if (err) {
        console.error(err);
      }
      // console.log(res);
    });
  }

  login(userId, sessionId, ip) {
    let loginQuery = {
      name: 'insert-login-history',
      text: 'INSERT INTO login_history(sessionId, userId, ip, login_at) VALUES($1, $2, $3, $4)',
      values: [sessionId, userId, ip, new Date()]
    }

    this.client.query(loginQuery, (err, res) => {
      if (err) {
        console.error(err);
      }
      // console.log(res);
    });
  }

  logoutUser(sessionId) {
    let updateQuery = {
      name: 'update-login-history',
      text: 'UPDATE login_history SET logout_at = $1 WHERE sessionId = $2',
      values: [new Date(), sessionId]
    }

    this.client.query(updateQuery, (err, res) => {
      if (err) {
        console.error(err);
      }
      // console.log(res);
    });
  }
}