const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {
  const ChatMessages = sequelize.define('ChatMessages', {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  ChatMessages.associate = (models) => {
    models.ChatMessages.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return ChatMessages;
};
