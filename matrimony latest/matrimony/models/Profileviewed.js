const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class ProfileView extends Model {}

ProfileView.init(
  {
    loggeduserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "userregistration",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      primaryKey: true, // part of composite primary key
    },
    profileviewedId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "userprofile",
        key: "profileId"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      primaryKey: true, // part of composite primary key
    },
    viewed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.NOW,
      primaryKey: true, // part of composite primary key
    },
  },
  {
    sequelize,
    modelName: "ProfileView",
    tableName: "profileview",
    timestamps: false,
  }
);

module.exports = ProfileView;
