const express = require('express');
const {
  registerBroker,
  loginBroker,
  getBrokerDashboard
} = require('../controllers/broker.controller');
const upload = require("../middleware/multerCofig");

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "id_proof", maxCount: 1 },
  ]),
  registerBroker
);
router.post('/login', loginBroker);
router.get('/dashboard/:brokerId', getBrokerDashboard);

module.exports = router;
