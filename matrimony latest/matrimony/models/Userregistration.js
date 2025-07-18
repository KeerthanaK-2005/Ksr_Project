const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Roles = require("./Roles.js");
const bcrypt = require("bcrypt")

class UserRegistration extends Model {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(11);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

UserRegistration.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (userRegistration) => {
       userRegistration.password = await UserRegistration.hashPassword(userRegistration.password);
      },
      beforeUpdate: async (userRegistration) => {
        if (userRegistration.changed("password")) {
          userRegistration.password = await UserRegistration.hashPassword(
            userRegistration.password,
          );
        }
      },
    },
    sequelize,
    tableName: "userregistration",
    modelName: "UserRegistration",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

// Associations
UserRegistration.belongsTo(Roles, { foreignKey: "roleId" });

module.exports = UserRegistration;
 