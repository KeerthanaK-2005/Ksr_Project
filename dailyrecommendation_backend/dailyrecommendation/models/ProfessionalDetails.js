const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class ProfessionalDetails extends Model {}

ProfessionalDetails.init(
  {
    careerId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    college: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employedIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    annualIncome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProfessionalDetails",
    tableName: "professionaldetails",
    timestamps: true,
  }
);

module.exports = ProfessionalDetails;