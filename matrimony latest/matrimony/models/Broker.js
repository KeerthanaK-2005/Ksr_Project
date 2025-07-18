const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Broker = sequelize.define('MarriageBrokers', {
  name: DataTypes.STRING,
  mobile_number: { type: DataTypes.STRING, unique: true },
  email: DataTypes.STRING,
  district: DataTypes.STRING,
  community: DataTypes.STRING,
  photo: DataTypes.STRING,
  id_proof: DataTypes.STRING,
  password: DataTypes.STRING,
  confirm_password: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  subscription_plan: {
    type: DataTypes.ENUM('basic', 'silver', 'gold', 'elite'),
    defaultValue: 'basic'
  },
  profile_upload_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  contact_view_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  commission_earned: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  referral_code: DataTypes.STRING,
  referred_by: DataTypes.STRING,
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: 'MarriageBrokers',
  timestamps: false
});

module.exports = Broker;
