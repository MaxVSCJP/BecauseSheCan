const express = require('express');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const adminUser = await AdminUser.findOne({ username: username.trim() });
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = await adminUser.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server auth not configured' });
    }

    const token = jwt.sign(
      {
        sub: adminUser._id.toString(),
        username: adminUser.username,
        role: adminUser.role,
      },
      secret,
      { expiresIn: '12h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({
      token,
      user: {
        id: adminUser._id,
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

router.get('/me', authenticateAdmin, async (req, res) => {
  return res.json({
    user: {
      id: req.admin.id,
      username: req.admin.username,
      role: req.admin.role,
    },
  });
});

router.post('/logout', async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
