const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {
  const ChatMessages = sequelize.define('ChatMessages', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  ChatMessages.associate = (models) => {
    models.ChatMessages.belongsTo(models.User);
  };

  return ChatMessages;
};
