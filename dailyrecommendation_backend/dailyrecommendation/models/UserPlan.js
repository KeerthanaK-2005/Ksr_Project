const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class UserPlan extends Model {}

UserPlan.init(
  {
    planId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    planType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    durationInMonths: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "userplans",
    modelName: "UserPlan",
    timestamps: false, // set to true if you want Sequelize to auto-manage timestamps
  }
);

module.exports = UserPlan;