const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const StoryComment = sequelize.define("StoryComment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  successStoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: "story_comments",
});

module.exports = StoryComment;
