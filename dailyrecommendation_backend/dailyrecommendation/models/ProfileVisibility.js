const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class ProfileVisibility extends Model {}

ProfileVisibility.init(
  {
    visibilityId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    profileId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "ProfileVisibility",
    tableName: "userprofile_visiblity",
    timestamps: false,
  }
);

module.exports = ProfileVisibility;