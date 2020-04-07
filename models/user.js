const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  User.prototype.validPassword = function validPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  return User;
};
