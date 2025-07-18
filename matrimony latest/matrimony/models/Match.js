// File: models/Match.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');

const Match = sequelize.define('Match', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  matchedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('accepted', 'mutual'),
    allowNull: false,
    defaultValue: 'accepted'
  }
}, {
  tableName: 'matches',
  timestamps: true
});

module.exports = Match;
