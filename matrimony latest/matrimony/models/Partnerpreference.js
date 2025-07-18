const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class PartnerPreference extends Model {}

PartnerPreference.init(
  {
    preferenceId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minAge: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    maxAge: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    minHeight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    maxHeight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    minWeight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    maxWeight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    educationLevel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    caste: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lifestyle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PartnerPreference",
    tableName: "partnerpreference",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = PartnerPreference;
