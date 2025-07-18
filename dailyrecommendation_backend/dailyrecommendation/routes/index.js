const express = require("express");
const router = express.Router();



const recommenduser = require('./recommend');

//Use routes
router.use('/api',recommenduser);

module.exports = router;