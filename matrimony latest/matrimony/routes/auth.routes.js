// File: routes/auth.routes.js
const express = require("express");
const {
  register,
  loginByEmail,
  createUserProfile,
  createPartnerPreference,
  getUserProfile,
} = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/access.controller");
const UserRegistration = require("../models/Userregistration");

const router = express.Router();

// Authentication
router.post("/register", register);
router.post("/login", loginByEmail);

// Protected: Requires user to be logged in
router.post("/user/profile", authenticateToken, createUserProfile);
router.post("/user/preference", authenticateToken, createPartnerPreference);

// Get current user's profile
router.get("/user/profile", authenticateToken, getUserProfile);

// Session check route
router.get("/check-session", authenticateToken, async (req, res) => {
  try {
    const user = await UserRegistration.findByPk(req.user.userId, {
      attributes: ["userId", "email", "lastActiveAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Session is still active",
      user: {
        id: user.userId,
        email: user.email,
        lastActiveAt: user.lastActiveAt,
      },
    });
  } catch (err) {
    console.error("Session check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
