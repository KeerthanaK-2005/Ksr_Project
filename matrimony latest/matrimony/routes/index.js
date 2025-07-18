const express = require("express");

const matchRoutes = require("../routes/match.routes");
const reportRoutes = require("../routes/report.routes");
const authRoutes = require("../routes/auth.routes");
const brokerRoutes = require("../routes/broker.routes");
const successRoutes = require("../routes/success.routes");
const brokerClientRoutes = require("../routes/brokerClient.routes");
const adminRoutes = require("../routes/admin.routes");
const timelineRoutes = require("../routes/timeline.routes");
const recommendRoutes = require("../routes/recommend.js");

const router = express.Router();

router.use("/match", matchRoutes);
router.use("/reports", reportRoutes);
router.use("/auth", authRoutes);
router.use("/broker", brokerRoutes);
router.use("/uploads", express.static("uploads"));
router.use("/", successRoutes);
router.use("/broker", brokerClientRoutes); // note: same base path as above
router.use("/", adminRoutes);
router.use("/timeline", timelineRoutes);
router.use("/recommend", recommendRoutes);

module.exports = router;
