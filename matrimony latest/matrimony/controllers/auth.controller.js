const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Userregistration");
const UserProfile = require("../models/Userprofile");
const PartnerPreference = require("../models/Partnerpreference");
const logger = require("../utils/logger");
const authService = require("../service/auth.service");

const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNo, roleId } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNo || !roleId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      roleId,
      lastActiveAt: new Date(),
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
    userId: newUser.userId,
    firstName: newUser.firstName,
    lastName: newUser.lastName, // <-- Add this line
    email: newUser.email,
    phoneNo: newUser.phoneNo,
    roleId: newUser.roleId,
  },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

const loginByEmail = async (req, res, next) => {
  const { email, password } = req.body;

  // Debug log: login attempt
  console.log('=== BACKEND LOGIN DEBUG START ===');
  console.log('Login attempt:', email, password);

  try {
    if (password && email) {
      const {
        accessToken,
        refreshToken,
        userId,
        firstName,
        lastName,
        roleId,
        email: userEmail,
        primaryContact,
        isBasicProfileSubmitted,
      } = await authService.loginByEmail(email, password);

      // Debug log: login result
      console.log('Login result:', {
        accessToken,
        userId,
        firstName,
        lastName,
        roleId,
        userEmail,
        primaryContact,
        isBasicProfileSubmitted,
      });
      console.log('=== BACKEND LOGIN DEBUG END ===');

      return res.json({
        accessToken,
        refreshToken,
        userId,
        firstName,
        lastName,
        roleId,
        email: userEmail,
        primaryContact,
        isBasicProfileSubmitted,
      });
    }

    return res.status(400).json({ error: "Email and password are required" });
  } catch (error) {
    // Debug log: login error
    console.error('Login error:', error);
    if (error && error.stack) {
      console.error('Login error stack:', error.stack);
    }
    console.log('=== BACKEND LOGIN DEBUG END ===');
    logger.error(`Error logging in: ${error.message}`);
    return res.status(401).json({ error: "Invalid credentials ..!" });
  }
};

const createUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const {
    firstName,
    lastName,
    email,
    alternateEmail,
    dateOfBirth,
    primaryContact,
    secondaryContact,
    height,
    weight,
    country,
    state,
    city,
    gender,
    bodyType,
    maritalStatus,
    children,
    wantChildren,
    religion,
    caste,
    subCaste,
    zodiacSign,
    starSign,
    dietPreferences,
    smokingHabits,
    drinkingHabits,
    motherTongue,
  } = req.body;

  try {
    const profile = await UserProfile.create({
      userId,
      firstName,
      lastName,
      email,
      alternateEmail,
      dateOfBirth,
      primaryContact,
      secondaryContact,
      height,
      weight,
      country,
      state,
      city,
      gender: gender ? gender.trim().toLowerCase() : undefined,
      bodyType,
      maritalStatus,
      children,
      wantChildren,
      religion,
      caste,
      subCaste,
      zodiacSign,
      starSign,
      dietPreferences,
      smokingHabits,
      drinkingHabits,
      motherTongue,
      isBasicProfileSubmitted: true,
    });

    res.status(201).json({ message: "Profile created", data: profile });
  } catch (err) {
    console.error("Create Profile Error:", err.errors);
    res.status(400).json({ message: "Failed to create profile", error: err.message });
  }
};

const createPartnerPreference = async (req, res) => {
  try {
    const preference = await PartnerPreference.create(req.body);
    res.status(201).json({ message: "Partner preference saved", preference });
  } catch (error) {
    res.status(500).json({ message: "Failed to save preference", error: error.message });
  }
};

// GET /user/profile - return the current user's profile
const getUserProfile = async (req, res) => {
  console.log('In getUserProfile, req.user:', req.user);
  try {
    const userId = req.user.userId;
    console.log('Fetching user profile for userId:', userId);
    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      console.log('User profile not found for userId:', userId);
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({
      message: 'User profile fetched successfully',
      data: {
        userId,
        ...profile.dataValues,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  loginByEmail,
  createUserProfile,
  createPartnerPreference,
  getUserProfile,
};
