const jwt = require("jsonwebtoken");
const UserRegistration = require("../models/Userregistration");
const UserProfile = require("../models/Userprofile");
const logger = require("../utils/logger");

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME.trim(),
  });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

// Login by Email
const loginByEmail = async (email, password) => {
  try {
    const user = await UserRegistration.scope("withPassword").findOne({
      where: { email },
      include: {
        model: UserProfile,
        as: "UserProfile",
        attributes: [
          "firstName",
          "lastName",
          "email",
          "primaryContact",
          "isBasicProfileSubmitted",
        ],
      },
    });

    if (!user) {
      logger.error(`Login attempt with invalid email: ${email}`);
      throw new Error("Invalid email / credentials");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.error(`Login attempt with invalid password for email: ${email}`);
      throw new Error("Invalid credentials");
    }

    const userId = user.userId;
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const profile = user.UserProfile;

    return {
      accessToken,
      refreshToken,
      userId,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      email: profile?.email || user.email,
      roleId: user.roleId || null,
      primaryContact: user.phoneNo || profile?.primaryContact || null,
      isBasicProfileSubmitted: profile?.isBasicProfileSubmitted ?? null,
    };
  } catch (error) {
    logger.error(
      `Error logging in with email: ${email}, error: ${error.message}\n${error.stack}`
    );
    throw new Error("Logging in with Invalid credentials");
  }
};

// ✅ Export default object for use in controller
const authService = {
  loginByEmail,
  generateAccessToken,
  generateRefreshToken,
};

module.exports = authService;
