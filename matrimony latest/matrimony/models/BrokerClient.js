const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const BrokerClient = sequelize.define('BrokerClients', {
  broker_id: DataTypes.INTEGER,
  client_profile_id: DataTypes.INTEGER,
  remarks: DataTypes.TEXT,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: 'BrokerClients',
  timestamps: false
});

module.exports = BrokerClient;
