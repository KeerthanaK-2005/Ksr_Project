const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const authMiddleware = require('../middleware/userAuth');

router.get('/recommend', authMiddleware, recommendController.generateDailyRecommendation);
router.patch('/recommendation/status', authMiddleware, recommendController.setRecommendationStatus);
router.post('/user/details', authMiddleware, recommendController.getUserDetails);

module.exports = router;