const { User } = require('../models');

module.exports = class UserService {
  static async register(username, password) {
    const existingUser = await User.findOne({
      where: {
        name: username,
      },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }
    return User.create({
      name: username,
      password,
    });
  }

  static updateRole(username, role) {
    return User.update({
      role,
    }, {
      where: {
        name: username,
      },
    });
  }
};
