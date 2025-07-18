const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class Report extends Model {
  static associate(models) {
    Report.belongsTo(models.User, {
      foreignKey: "reportedUserId",
      as: "reportedUser",
    });
  }
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    timestamps: true,
  }
);

module.exports = Report;