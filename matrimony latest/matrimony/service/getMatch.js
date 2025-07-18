// File: services/getMatchCandidates.js
const { Op } = require("sequelize");
const UserProfile = require("../models/Userprofile");
const PartnerPreference = require("../models/Partnerpreference");
const ProfileView = require("../models/Profileviewed");

function calculateAge(dob) {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const getMatchCandidates = async (userId) => {
  const userPrefs = await PartnerPreference.findOne({ where: { userId } });
  const user = await UserProfile.findOne({ where: { userId } });

  if (!userPrefs || !user) return [];

  const today = new Date().toISOString().split("T")[0];

  // ✅ Get profile IDs already viewed today
  const seen = await ProfileView.findAll({
    where: {
      loggeduserId: userId,
      viewed_date: today,
    },
    attributes: ["profileviewedId"],
  });

  const seenIds = seen.map((s) => s.profileviewedId);

  // 🔍 Get unviewed, opposite-gender profiles
  const potentialMatches = await UserProfile.findAll({
    where: {
      userId: { [Op.ne]: userId },
      gender: userPrefs.sex,
      userId: { [Op.notIn]: seenIds },
    },
  });

  let scoredMatches = potentialMatches.map((match) => {
    let score = 0;
    const age = calculateAge(match.dateOfBirth);

    if (age >= parseInt(userPrefs.minAge) && age <= parseInt(userPrefs.maxAge)) score += 20;
    if (match.height >= parseInt(userPrefs.minHeight) && match.height <= parseInt(userPrefs.maxHeight)) score += 15;
    if (match.weight >= parseInt(userPrefs.minWeight) && match.weight <= parseInt(userPrefs.maxWeight)) score += 10;
    if (userPrefs.educationLevel && match.education === userPrefs.educationLevel) score += 15;
    if (userPrefs.religion && match.religion === userPrefs.religion) score += 10;
    if (userPrefs.caste && match.caste === userPrefs.caste) score += 10;
    if (userPrefs.state && match.state === userPrefs.state) score += 10;
    if (userPrefs.city && match.city === userPrefs.city) score += 10;

    console.log(`Match: ${match.userId}, Score: ${score}`);
    return { ...match.dataValues, score };
  });

  // 🛡️ Fallback: if very few strong matches, include gender-only suggestions
  if (scoredMatches.length < 3) {
    const fallback = potentialMatches
      .filter((m) => !scoredMatches.find((s) => s.userId === m.userId))
      .map((match) => ({ ...match.dataValues, score: 20 }));

    scoredMatches = [...scoredMatches, ...fallback].slice(0, 5);
  }

  scoredMatches.sort((a, b) => b.score - a.score);

  return scoredMatches.slice(0, 5);
};

module.exports = getMatchCandidates;
