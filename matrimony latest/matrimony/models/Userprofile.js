// models/Userprofile.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const UserRegistration = require("./Userregistration");

class UserProfile extends Model {}

UserProfile.init(
  {
    profileId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    alternateEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    primaryContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    weight: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bodyType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    children: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wantChildren: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    caste: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    subCaste: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zodiacSign: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    starSign: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dietPreferences: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    smokingHabits: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    drinkingHabits: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motherTongue: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isBasicProfileSubmitted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "UserProfile",
    tableName: "userprofile",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

UserProfile.associate = (models) => {
  UserProfile.hasMany(models.ProfileView, {
    foreignKey: "profileviewedId",
    as: "viewsReceived",
  });
};

UserProfile.belongsTo(UserRegistration, { foreignKey: "userId", as: "User" });

module.exports = UserProfile;
