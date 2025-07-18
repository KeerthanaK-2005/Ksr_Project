// models/UserInterest.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // adjust path as per your structure

class UserInterest extends Model {}

UserInterest.init(
  {
    interestId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hobbiesAndInterests: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    travelPreferences: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    musicOrMovieTastes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sportsAndFitness: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    socialCausesOfInterest: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    languagesKnown: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cuisinePreferences: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    habits: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    dietPreferences: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserInterest',
    tableName: 'userinterest',
    timestamps: true,
  }
);

module.exports = UserInterest;