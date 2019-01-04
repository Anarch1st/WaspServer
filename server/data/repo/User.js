class User {
  constructor(params) {
    this.id = params.id;
    this.username = params.username;
    this.password = params.password;
    this.roles = Array.isArray(params.roles) ? params.roles : [];
  }

  static getUsersList(array) {
    let usersList = [];

    array.forEach((item) => {
      usersList.push(new User(item));
    });

    return usersList;
  }
}
module.exports = User