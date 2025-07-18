const jwt = require("jsonwebtoken");
const User = require("../models/Userregistration.js");
const Settings = require("../models/Settings.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const setting = await Settings.findOne({ where: { key: "session_timeout" } });
    const timeout = parseInt(setting?.value) || 15 * 60 * 1000; // fallback 15min

    const now = new Date();
    const lastActive = new Date(user.lastActiveAt || now);
    const diff = now - lastActive;

    if (diff > timeout) {
      return res.status(440).json({ message: "Session expired. Please log in again." });
    }

    user.lastActiveAt = now;
    await user.save();

    req.user = {
      userId: user.userId,
      email: user.email,
      lastActiveAt: user.lastActiveAt,
      roleId: user.roleId,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token or session expired." });
  }
};

module.exports = authMiddleware;
