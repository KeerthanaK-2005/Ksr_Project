// models/SuccessStory.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const SuccessStory = sequelize.define("SuccessStory", {
  brideName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groomName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  partneruserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engagementDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  marriageDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  photoUrl: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  countryLivingIn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  successStory: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = SuccessStory;
