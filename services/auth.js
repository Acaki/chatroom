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

  static getUsers(id) {
    if (id) {
      return User.findByPk(id);
    }
    return User.findAll({
      attributes: ['id', 'name', 'role'],
      order: [['id', 'ASC']],
    });
  }

  static updateUser(id, fieldValues) {
    return User.update(fieldValues, {
      where: {
        id,
      },
    });
  }

  static createUser(username, password) {
    return User.create({
      name: username,
      password,
    });
  }

  static deleteUser(id) {
    return User.destroy({
      where: {
        id,
      },
    });
  }
};
