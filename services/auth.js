const { User } = require('../models');
const { DuplicateRegisterError } = require('./error');

module.exports = class UserService {
  static async register(username, password) {
    const existingUser = await User.findOne({
      where: {
        name: username,
      },
    });
    if (existingUser) {
      throw new DuplicateRegisterError('User already exists');
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
      order: [['id', 'ASC']],
      attributes: ['id', 'name', 'role'],
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
