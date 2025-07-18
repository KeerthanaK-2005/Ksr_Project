const { Op, where } = require('sequelize');
const sequelize = require('../config/sequelize');
const UserRegistration = require('../models/Userregistration');
const PatnerPreference = require('../models/Partnerpreference');
const UserFamilyDetails = require('../models/UserFamilyDetails');
const ProfessionalDetails = require('../models/ProfessionalDetails');
const DailyRecommendation = require('../models/DailyRecommendation');
const UserProfile = require('../models/Userprofile');
const UserInterest = require('../models/UserInterest');
const jwt = require('jsonwebtoken');

exports.generateDailyRecommendation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const userProfile = await UserProfile.findOne({ where: { userId } });
    if (!userProfile || !userProfile.gender) {
      return res.status(404).json({ message: 'User profile not found or incomplete' });
    }
    const today = new Date().toISOString().slice(0, 10);
    const oppositeGender = userProfile.gender.toLowerCase() === 'male' ? 'female' : 'male';
    const alreadyRecommended = await DailyRecommendation.findAll({
      where: {
        userId,
        recommendedDate: { [Op.startsWith]: today }
      }
    });
    if (alreadyRecommended.length > 0) {
      const recommendedUserIds = alreadyRecommended.map(r => r.recommendedUserId);
      const recommendedProfiles = await UserProfile.findAll({
        where: { userId: { [Op.in]: recommendedUserIds } }
      });
      return res.status(200).json({
        message: 'Already recommended today for userId '+userId,
        recommendedProfiles
      });
    }
    const fetchedProfiles = await UserProfile.findAll({
      where: {
        gender: oppositeGender,
        userId: { [Op.ne]: userId },
        isBasicProfileSubmitted: true,
        firstName: { [Op.ne]: userProfile.firstName }
      },
      order: sequelize.random(),
      limit: 30
    });
    const uniqueProfiles = [];
    const seenNames = new Set();
    for (const profile of fetchedProfiles) {
      if (!seenNames.has(profile.firstName.toLowerCase())) {
        seenNames.add(profile.firstName.toLowerCase());
        uniqueProfiles.push(profile);
      }
      if (uniqueProfiles.length === 5) break;
    }
    if (uniqueProfiles.length < 5) {
      return res.status(404).json({ message: 'Not enough unique recommendations found' });
    }
    const currentTimestamp = new Date();
    const entries = uniqueProfiles.map(profile => ({
      userId,
      recommendedUserId: profile.userId,
      recommendedDate: currentTimestamp,
      status: 'approved',
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    }));
    await DailyRecommendation.bulkCreate(entries);
    res.status(200).json({
      message: 'Recommendations generated successfully for userId '+userId,
      recommendedProfiles: uniqueProfiles
    });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.setRecommendationStatus = async (req, res) => {
  const { userId, recommendedUserId, status } = req.body;
  if (!userId || !recommendedUserId || !status) {
    return res.status(400).json({ message: 'userId, recommendedUserId, and status are required' });
  }
  if (!['approved', 'disapproved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Must be approved or disapproved' });
  }
  try {
    const recommendation = await DailyRecommendation.findOne({
      where: { userId, recommendedUserId }
    });
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    recommendation.status = status;
    await recommendation.save();
    res.status(200).json({
      message: `Status updated to '${status}' successfully`,
      updatedRecommendation: recommendation
    });
  } catch (error) {
    console.error('Error updating recommendation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { userId, email, password } = decoded;
    let user;
    if (userId) {
      user = await UserRegistration.findOne({ where: { userId } });
    } else if (email) {
      user = await UserRegistration.findOne({ where: { email } });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const [userProfile, patnerPreference, professionalDetails, userFamilyDetails, userinterest] = await Promise.all([
      UserProfile.findOne({ where: { userId: user.userId } }),
      PatnerPreference.findOne({ where: { userId: user.userId } }),
      ProfessionalDetails.findOne({ where: { userId: user.userId } }),
      UserFamilyDetails.findOne({ where: { userId: user.userId } }),
      UserInterest.findOne({ where: { userId: user.userId } })
    ]);
    return res.status(200).json({
      message : "Details fetched for the userId "+user.userId,
      userProfile,
      patnerPreference,
      professionalDetails,
      userFamilyDetails,
      userinterest
    });
  } catch (error) {
    console.error('Error verifying token or fetching user details:', error);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
}; 