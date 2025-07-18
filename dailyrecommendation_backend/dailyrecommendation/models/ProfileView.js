const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class ProfileView extends Model {}

ProfileView.init(
  {
    profileViewId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    viewerUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    viewedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    viewerPlanType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastViewedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    lastViewedTime: {
      type: DataTypes.TIME,
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
    modelName: "ProfileView",
    tableName: "profileviews",
    timestamps: false,
  }
);

module.exports = ProfileView;