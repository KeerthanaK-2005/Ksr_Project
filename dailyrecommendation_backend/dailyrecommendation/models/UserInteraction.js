const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class UserInteraction extends Model {}

UserInteraction.init(
  {
    interactionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    targetUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interactionType: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    interactionCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    disliked: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedAt',
    },
  },
  {
    sequelize,
    modelName: 'UserInteraction',
    tableName: 'userinteraction',
    timestamps: true,
  }
);

module.exports = UserInteraction;