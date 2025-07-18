const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const adminRegister = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await Admin.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      roleId: 1,
    });

    res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { adminId: admin.adminId, roleId: admin.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
};
