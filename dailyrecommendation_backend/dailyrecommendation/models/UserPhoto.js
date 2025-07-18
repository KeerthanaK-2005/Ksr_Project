const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class UserPhoto extends Model {}

UserPhoto.init(
  {
    photoId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserPhoto",
    tableName: "userphoto",
    timestamps: false,
  }
);

module.exports = UserPhoto;