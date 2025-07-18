const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Report = sequelize.define('Report', {
  reporter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reported_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'unresolved',
  },
}, {
  timestamps: true,
});

module.exports = Report;
