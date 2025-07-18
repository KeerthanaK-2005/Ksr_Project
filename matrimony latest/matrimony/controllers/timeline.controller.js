const db = require("../models");
const { SuccessStory, SuccessStoryTimelineEvent } = db;

const addTimelineEvent = async (req, res) => {
  try {
    const { successStoryId } = req.params;
    const { title, description, eventDate, mediaUrl } = req.body;

    const badgeOptions = SuccessStoryTimelineEvent.rawAttributes.badges.values;
    const randomBadge = badgeOptions[Math.floor(Math.random() * badgeOptions.length)];

    const newEvent = await SuccessStoryTimelineEvent.create({
      successStoryId,
      title,
      description,
      eventDate,
      mediaUrl,
      badges: randomBadge,
    });

    res.status(201).json({
      message: "Timeline event added with badge",
      data: newEvent,
    });
  } catch (error) {
    console.error("Add timeline event error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getTimelineForStory = async (req, res) => {
  try {
    const { successStoryId } = req.params;

    const events = await SuccessStoryTimelineEvent.findAll({
      where: { successStoryId },
      order: [["eventDate", "ASC"]],
    });

    res.json({ message: "Timeline fetched", data: events });
  } catch (err) {
    console.error("Get timeline error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addTimelineEvent,
  getTimelineForStory,
};
