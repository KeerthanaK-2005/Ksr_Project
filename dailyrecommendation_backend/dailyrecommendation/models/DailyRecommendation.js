const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class DailyRecommendation extends Model {}

DailyRecommendation.init(
  {
    recommendationId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommendedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommendedDate: {
      type: DataTypes.DATE, // stores both date and time
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("approved", "disapproved"),
      allowNull: false,
      defaultValue: "approved",
    },
  },
  {
    sequelize,
    modelName: "DailyRecommendation",
    tableName: "daily_recommendation",
    timestamps: true,
  }
);

module.exports = DailyRecommendation;