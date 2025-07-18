const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+05:30", // Indian Standard Time
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // Set to true if you want to debug SQL logs
    define: {
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
  }
);

module.exports = sequelize;
