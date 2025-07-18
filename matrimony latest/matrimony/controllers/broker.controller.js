const Broker = require('../models/Broker');
const BrokerClient = require('../models/BrokerClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const registerBroker = async (req, res) => {
  try {
    const {
      name,
      mobile_number,
      email,
      district,
      community,
      subscription_plan,
      password,
    } = req.body;

    const photoFile = req.files?.photo?.[0];
    const idProofFile = req.files?.id_proof?.[0];

    const photo = photoFile ? `/uploads/brokers/${photoFile.filename}` : null;
    const id_proof = idProofFile ? `/uploads/brokers/${idProofFile.filename}` : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const broker = await Broker.create({
      name,
      mobile_number,
      email,
      district,
      community,
      photo,
      id_proof,
      subscription_plan,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ message: 'Broker registered', broker });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({
      error: 'Failed to register broker',
      details: err.errors ? err.errors.map(e => e.message) : err.message,
    });
  }
};

const loginBroker = async (req, res) => {
  try {
    const { mobile_number, email, password } = req.body;
    let broker;

    if (mobile_number) {
      broker = await Broker.findOne({ where: { mobile_number } });
    } else if (email) {
      broker = await Broker.findOne({ where: { email } });
    } else {
      return res.status(400).json({ error: "Please provide either mobile_number or email." });
    }

    if (!broker) {
      return res.status(404).json({ error: 'Broker not found' });
    }

    const isMatch = await bcrypt.compare(password, broker.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { brokerId: broker.id, name: broker.name },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({ message: 'Login success', token, broker });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

const getBrokerDashboard = async (req, res) => {
  try {
    const brokerId = req.params.brokerId;
    console.log("Fetching dashboard for broker ID:", brokerId);

    const broker = await Broker.findByPk(brokerId);
    if (!broker) {
      return res.status(404).json({ error: "Broker not found" });
    }

    const clients = await BrokerClient.findAll({ where: { broker_id: brokerId } });

    res.json({ broker, clients });
  } catch (err) {
    console.error("Error in getBrokerDashboard:", err.message);
    res.status(500).json({ error: "Failed to fetch dashboard", reason: err.message });
  }
};

module.exports = {
  registerBroker,
  loginBroker,
  getBrokerDashboard,
};
