// models/SuccessStoryTimelineEvent.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const SuccessStoryTimelineEvent = sequelize.define("SuccessStoryTimelineEvent", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  successStoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  badges: {
    type: DataTypes.ENUM(
      'First Meeting', 'Engaged', 'Married', 'Traditional Wedding', 'Reception', 'Destination Wedding',
      'Love Marriage', 'Arranged Marriage', 'Haldi Ceremony', 'Mehendi Night', 'Sangeet Night',
      'Bachelor Party', 'Bachelorette Party', 'Pre-Wedding Shoot', 'Wedding Anniversary',
      'Honeymoon', 'Temple Wedding', 'Beach Wedding', 'Court Marriage', 'Elopement',
      'International Wedding', 'Cultural Fusion', 'Bridal Shower', 'Groom Squad', 'Bridal Entry',
      'Grand Baraat', 'Ring Exchange', 'Family Blessings', 'Homecoming', 'Baby Shower',
      'Anniversary Surprise', 'Renewal of Vows', 'First Home', 'First Trip Together'
    ),
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: "successstorytimelineevents"
});

module.exports = SuccessStoryTimelineEvent;
