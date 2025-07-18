const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class Roles extends Model {}

Roles.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Roles",
    tableName: "roles",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Roles;
