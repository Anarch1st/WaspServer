const bcrypt = require('bcrypt');

class User {
  constructor(params) {
    this.id = params.id;
    this.username = params.username;
    this.password = params.password;
    this.created_at = params.created_at;
    this.permissions = params.permissions;
    this.is_deleted = params.is_deleted;
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = User;