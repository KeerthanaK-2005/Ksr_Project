const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class PatnerPreference extends Model {}

PatnerPreference.init(
  {
    preferenceId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minAge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxAge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minHeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxHeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caste: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lifestyle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minWeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxWeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PatnerPreference",
    tableName: "partnerpreference",
    timestamps: true,
  }
);

module.exports = PatnerPreference;