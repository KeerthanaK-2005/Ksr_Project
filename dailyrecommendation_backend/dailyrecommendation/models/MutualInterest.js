const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const UserProfile = require('./UserProfile');

class MutualInterest extends Model {}

MutualInterest.init(
  {
    mutualId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    profile1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profile2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    req_meeting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    profile1action: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    profile2action: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'MutualInterest',
    tableName: 'mutualintrest',
    timestamps: false,
  }
);

// MutualInterest associations
MutualInterest.belongsTo(UserProfile, {
  foreignKey: 'profile1',
  as: 'profile1Details'
});

MutualInterest.belongsTo(UserProfile, {
  foreignKey: 'profile2',
  as: 'profile2Details'
});


module.exports = MutualInterest;