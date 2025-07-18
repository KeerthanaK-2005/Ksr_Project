const express = require('express');
const multer = require("multer");
const path = require('path');
const {submitSuccessStory, getAllSuccessStories, getUnapprovedStories, approveSuccessStory } = require("../controllers/success.controller.js");
const { authenticateToken }  = require("../middleware/access.controller.js");
const { likeSuccessStory } = require("../controllers/success.controller.js");
const { addComment } = require("../controllers/success.controller.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post("/submit-success-story",authenticateToken, upload.array("photo", 5), submitSuccessStory );

router.get("/admin/unapproved-success-stories", getUnapprovedStories);

router.post("/admin/approve-success-story", approveSuccessStory); 

router.get("/success-stories", getAllSuccessStories);

router.post("/like/:id", authenticateToken, likeSuccessStory);

router.post("/comment", authenticateToken, addComment);

module.exports = router;