const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const StoryLike = sequelize.define("StoryLike", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  successStoryId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: true,
  tableName: "story_likes",
  indexes: [{ unique: true, fields: ['userId', 'successStoryId'] }]
});

module.exports = StoryLike;
