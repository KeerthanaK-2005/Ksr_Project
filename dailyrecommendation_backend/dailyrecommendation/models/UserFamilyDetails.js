const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class UserFamilyDetails extends Model {}

UserFamilyDetails.init(
  {
    familyId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familyType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyValues: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentsOccupations: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherParentsOccupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sibilings: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UserFamilyDetails",
    tableName: "userfamilydetails",
    timestamps: true, // includes createdAt and updatedAt
  }
);

module.exports = UserFamilyDetails;