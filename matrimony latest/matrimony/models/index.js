const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");

const Userregistration = require("./Userregistration");
const Userprofile = require("./Userprofile");
const Partnerpreference = require("./Partnerpreference");
const Roles = require("./Roles");
const ProfileView = require("./Profileviewed");
const Report = require("./Report");
const SuccessStory = require("./SuccessStory");
const Match = require("./Match");
const Admin = require("./Admin");
const SuccessStoryTimelineEvent = require("./SuccessStoryTimelineEvent");
const StoryLike = require("./StoryLike");
const StoryComment = require("./StoryComment");
const DailyRecommendation = require("./DailyRecommendation");
const UserFamilyDetails = require("./UserFamilyDetails");
const ProfessionalDetails = require("./ProfessionalDetails");
const UserInterest = require("./UserInterest");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Userregistration = Userregistration;
db.Userprofile = Userprofile;
db.Partnerpreference = Partnerpreference;
db.Roles = Roles;
db.ProfileView = ProfileView;
db.Report = Report;
db.Match = Match;
db.SuccessStory = SuccessStory;
db.Admin = Admin;
db.SuccessStoryTimelineEvent = SuccessStoryTimelineEvent;
db.StoryComment = StoryComment;
db.DailyRecommendation = DailyRecommendation;
db.UserFamilyDetails = UserFamilyDetails;
db.ProfessionalDetails = ProfessionalDetails;
db.UserInterest = UserInterest;

// Optional custom associate functions
if (Userprofile.associate) {
  Userprofile.associate(db);
}
if (ProfileView.associate) {
  ProfileView.associate(db);
}

// ✅ Story Associations
SuccessStory.hasMany(SuccessStoryTimelineEvent, {
  foreignKey: "successStoryId",
  as: "timelineEvents",
});
SuccessStoryTimelineEvent.belongsTo(SuccessStory, {
  foreignKey: "successStoryId",
  as: "story",
});

SuccessStory.hasMany(StoryLike, {
  foreignKey: "successStoryId",
  onDelete: "CASCADE",
});
StoryLike.belongsTo(SuccessStory, {
  foreignKey: "successStoryId",
});

SuccessStory.hasMany(StoryComment, {
  foreignKey: "successStoryId",
  as: "comments",
});
StoryComment.belongsTo(SuccessStory, {
  foreignKey: "successStoryId",
});

StoryComment.belongsTo(Userprofile, {
  foreignKey: "userId",
  as: "CommentedBy",
});
Userprofile.hasMany(StoryComment, {
  foreignKey: "userId",
  as: "comments",
});

Userregistration.hasOne(Userprofile, {
  foreignKey: "userId",
  as: "UserProfile",
});
Userprofile.belongsTo(Userregistration, {
  foreignKey: "userId",
  as: "RegisteredUser",
});

// Sync DB
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("✅ Database synced");
  } catch (err) {
    console.error("❌ Failed to sync database:", err);
  }
})();

module.exports = db;
