const express = require('express');
const { addTimelineEvent, getTimelineForStory } = require("../controllers/timeline.controller.js");
const { authenticateToken } = require("../middleware/access.controller.js");

const router = express.Router();

router.post("/:successStoryId", authenticateToken, addTimelineEvent);
router.get("/:successStoryId", getTimelineForStory);

module.exports = router;