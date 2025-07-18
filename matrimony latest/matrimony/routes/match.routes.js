const express = require('express');
const { acceptMatch, getDailyMatches } = require('../controllers/match.controller');

const router = express.Router();

router.get('/daily', getDailyMatches);
router.post('/accept', acceptMatch);

module.exports = router;
