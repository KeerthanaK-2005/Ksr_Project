const db = require("../models");
const { Op } = require("sequelize");
const StoryLike = require("../models/StoryLike");
const StoryComment = require("../models/StoryComment");

const { SuccessStory, Userprofile, Match } = db;

let ioInstance = null;
const initSocket = (io) => {
  ioInstance = io;
};

const submitSuccessStory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      email,
      engagementDate,
      marriageDate,
      address,
      countryLivingIn,
      countryCode,
      telephone,
      successStory,
    } = req.body;

    const alreadySubmitted = await SuccessStory.findOne({
      where: { userId },
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        error: "You have already submitted a success story.",
        existingStory: alreadySubmitted,
      });
    }

    const mutualMatch = await Match.findOne({
      where: {
        [Op.or]: [
          { userId, status: "mutual" },
          { matchedUserId: userId, status: "mutual" },
        ],
      },
    });

    if (!mutualMatch) {
      return res.status(400).json({ error: "No mutual match found." });
    }

    const partnerUserId =
      mutualMatch.userId === userId
        ? mutualMatch.matchedUserId
        : mutualMatch.userId;

    const userProfile = await Userprofile.findOne({ where: { userId } });
    const partnerProfile = await Userprofile.findOne({ where: { userId: partnerUserId } });

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile not found. Please complete your profile before submitting a story.' });
    }
    if (!partnerProfile) {
      return res.status(400).json({ error: 'Partner profile not found. Please ask your partner to complete their profile before submitting a story.' });
    }
    if (!userProfile.gender || !['male', 'female'].includes(userProfile.gender.toLowerCase())) {
      return res.status(400).json({ error: 'Your gender is missing or invalid in your profile. Please update your profile with the correct gender (male/female).' });
    }

    const brideName =
      userProfile.gender === "female"
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : `${partnerProfile.firstName} ${partnerProfile.lastName}`;

    const groomName =
      userProfile.gender === "male"
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : `${partnerProfile.firstName} ${partnerProfile.lastName}`;

    let photoUrl = [];

    if (req.files && req.files.length > 0) {
      photoUrl = req.files.map((file) => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      });
    }

    // Always use email and countryCode from userProfile
    const emailToSave = userProfile.email || '';
    const countryCodeToSave = userProfile.countryCode || '';

    const newStory = await SuccessStory.create({
      brideName,
      groomName,
      userId: userProfile.userId,
      partneruserId: partnerProfile.userId,
      email: emailToSave,
      engagementDate,
      marriageDate,
      photoUrl,
      address,
      countryLivingIn,
      countryCode: countryCodeToSave,
      telephone,
      successStory,
      approved: false,
    });

    if (ioInstance) {
      ioInstance.emit("new_success_story", newStory);
    }

    return res.status(201).json({
      message: "Success story submitted.",
      data: newStory,
    });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllSuccessStories = async (req, res) => {
  try {
    const { year, country, countryCode, address } = req.query;
    const whereClause = { approved: true };

    if (year) {
      whereClause.marriageDate = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }

    if (country) {
      whereClause.countryLivingIn = { [Op.like]: `%${country}%` };
    }

    if (countryCode) {
      whereClause.countryCode = countryCode;
    }

    if (address) {
      whereClause.address = { [Op.like]: `%${address}%` };
    }

    const stories = await SuccessStory.findAll({
      attributes: [
        "id",
        "brideName",
        "groomName",
        "userId",
        "partneruserId",
        "marriageDate",
        "photoUrl",
        "successStory",
        "likes",
        "address",
        "countryLivingIn",
        "countryCode",
        "telephone",
      ],
      where: whereClause,
      order: [["likes", "DESC"], ["marriageDate", "DESC"]],
      include: [
        {
          model: StoryComment,
          as: "comments",
        },
      ],
    });

    if (stories.length === 0) {
      return res.status(404).json({
        message: "No success stories found for the given criteria.",
      });
    }

    res.json({
      message: "Success stories fetched successfully.",
      data: stories,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getUnapprovedStories = async (req, res) => {
  try {
    const stories = await SuccessStory.findAll({
      where: { approved: false },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Unapproved success stories fetched",
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching unapproved success stories:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const approveSuccessStory = async (req, res) => {
  try {
    const storyId = req.body.id;

    const story = await SuccessStory.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    story.approved = true;
    await story.save();

    res.status(200).json({ message: "Story approved", data: story });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ error: "Approval failed" });
  }
};

const likeSuccessStory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const storyId = req.params.id;

    const story = await SuccessStory.findByPk(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });

    const existing = await StoryLike.findOne({
      where: { userId, successStoryId: storyId },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "You have already liked this story" });
    }

    await StoryLike.create({ userId, successStoryId: storyId });
    story.likes += 1;
    await story.save();

    return res
      .status(200)
      .json({ message: "Story liked successfully", likes: story.likes });
  } catch (error) {
    console.error("Error liking story:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { successStoryId, comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const story = await SuccessStory.findByPk(successStoryId);
    if (!story) {
      return res.status(404).json({ error: "Success story not found" });
    }

    const newComment = await StoryComment.create({
      successStoryId,
      userId,
      comment,
    });

    res.status(201).json({ message: "Comment added", data: newComment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  initSocket,
  submitSuccessStory,
  getAllSuccessStories,
  getUnapprovedStories,
  approveSuccessStory,
  likeSuccessStory,
  addComment,
};
