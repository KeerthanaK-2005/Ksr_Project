const express = require('express');
const { registerBrokerClient } = require('../controllers/brokerClient.controller');

const router = express.Router();

router.post('/clients/register', registerBrokerClient);

module.exports = router;
