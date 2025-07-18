const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { sendErrorResponse } = require("../utils/response.helper");

// Publicly accessible routes
const publicPaths = ["/public", "/lms", "/images"];

/**
 * Authenticate Token
 */
const authenticateToken = (req, res, next) => {
  console.log('authenticateToken middleware called, authHeader:', req.headers['authorization']);
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const isPublicPath = publicPaths.some((path) =>
    req.originalUrl.startsWith(path)
  );
  if (isPublicPath) {
    return next();
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.log('Decoded token:', decodedToken);
    req.user = { userId: decodedToken.userId };
    console.log('req.user:', req.user);
    next();
  });
};

/**
 * Blacklist Validation
 */
const checkBlacklist = async (token, res) => {
  try {
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token is invalid" });
    }
  } catch (err) {
    console.error("Error checking blacklist:", err);
    throw err;
  }
};

module.exports = {
  authenticateToken,
  checkBlacklist,
};
