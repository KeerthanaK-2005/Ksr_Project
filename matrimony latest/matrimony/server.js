const cron = require("node-cron");
const UserRegistration = require("./models/Userregistration.js");
const getMatchCandidates = require("./service/getMatch.js");
const SeenMatches = require("./models/Profileviewed.js");
const ProfileView = require("./models/Profileviewed.js");

cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running daily match generation...");

  const users = await UserRegistration.findAll();
  const today = new Date().toISOString().split("T")[0];

  for (const user of users) {
    const already = await SeenMatches.findOne({ where: { userId: user.userId, seen_date: today } });
    if (already) continue;

    const matches = await getMatchCandidates(user.userId);
    for (const match of matches) {
      await ProfileView.create({
        userId: user.userId,
        matchedUserId: match.userId,
        seen_date: today,
      });
    }

    console.log(`✅ Matches generated for user ${user.userId}`);
  }
});
