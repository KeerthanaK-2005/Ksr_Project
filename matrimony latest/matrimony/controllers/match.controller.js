const ProfileView = require("../models/Profileviewed");
const Match = require("../models/Match");
const UserProfile = require("../models/Userprofile");
const User = require("../models/Userregistration");
const getMatchCandidates = require("../service/getMatch");

const getDailyMatches = async (req, res) => {
  const userId = parseInt(req.query.userId);
  const today = new Date().toISOString().split("T")[0];

  try {
    // 1️⃣ Skip if already seen today
    const seenToday = await ProfileView.findAll({
      where: { loggeduserId: userId, viewed_date: today },
    });

    if (seenToday.length > 0) {
      const matchedProfiles = await Promise.all(
        seenToday.map(async (entry) =>
          await UserProfile.findOne({ where: { profileId: entry.profileviewedId } })
        )
      );
      return res.status(200).json({
        message: "Today's matches already suggested.",
        matches: matchedProfiles.filter(Boolean),
      });
    }

    // 2️⃣ Get all userIds that are already accepted/mutual
    const previousMatches = await Match.findAll({
      where: {
        userId,
        status: ['accepted', 'mutual'],
      },
      attributes: ['matchedUserId'],
    });

    const blockedIds = previousMatches.map((m) => m.matchedUserId);

    // 3️⃣ Get fresh matches excluding blockedIds
    const matches = await getMatchCandidates(userId);
    const freshMatches = matches.filter(m => !blockedIds.includes(m.userId));

    if (freshMatches.length === 0) {
      return res.status(404).json({ message: "No matches found today." });
    }

    // 4️⃣ Store fresh suggestions
    for (const match of freshMatches) {
      const matchProfile = await UserProfile.findOne({ where: { userId: match.userId } });
      if (!matchProfile) continue;

      await ProfileView.create({
        loggeduserId: userId,
        profileviewedId: matchProfile.profileId,
        viewed_date: today,
      });
    }

    return res.status(200).json({ message: "New matches generated.", matches: freshMatches });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch matches.", error: err.message });
  }
};

const acceptMatch = async (req, res) => {
  const { userId, matchedUserId } = req.body;

  try {
    await Match.create({ userId, matchedUserId, status: 'accepted' });

    const reverse = await Match.findOne({
      where: { userId: matchedUserId, matchedUserId: userId, status: 'accepted' }
    });

    if (!reverse) {
      return res.json({ message: "Match accepted. Waiting for mutual acceptance." });
    }

    await Match.update({ status: 'mutual' }, {
      where: { userId, matchedUserId }
    });
    await Match.update({ status: 'mutual' }, {
      where: { userId: matchedUserId, matchedUserId: userId }
    });

    return res.status(200).json({ message: "Mutual Match! Now you can post your success story." });
  } catch (error) {
    console.error("Accept match error:", error);
    res.status(500).json({ error: "Server error while accepting match." });
  }
};

module.exports = {
  getDailyMatches,
  acceptMatch,
};
