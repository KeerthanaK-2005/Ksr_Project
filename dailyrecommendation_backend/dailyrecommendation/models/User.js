const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class User extends Model {
  static associate(models) {
    User.hasMany(models.Report, {
      foreignKey: "reportedUserId",
      as: "reports",
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    timestamps: true,
  }
);

module.exports = User;