const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const FormField = require('../models/FormField');
const RaffleSettings = require('../models/RaffleSettings');
const Participant = require('../models/Participant');

const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Superadmin access required' });
  }
  return next();
};

// Get all form fields
router.get('/fields', async (req, res) => {
  try {
    const fields = await FormField.find().sort({ order: 1 });
    res.json(fields);
  } catch (error) {
    console.error('Error fetching form fields:', error);
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
});

// Create form field
router.post('/fields', async (req, res) => {
  try {
    const field = new FormField(req.body);
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    console.error('Error creating form field:', error);
    res.status(500).json({ error: 'Failed to create form field' });
  }
});

// Update form field
router.put('/fields/:id', async (req, res) => {
  try {
    const field = await FormField.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!field) {
      return res.status(404).json({ error: 'Form field not found' });
    }
    res.json(field);
  } catch (error) {
    console.error('Error updating form field:', error);
    res.status(500).json({ error: 'Failed to update form field' });
  }
});

// Delete form field
router.delete('/fields/:id', async (req, res) => {
  try {
    const field = await FormField.findByIdAndDelete(req.params.id);
    if (!field) {
      return res.status(404).json({ error: 'Form field not found' });
    }
    res.json({ message: 'Form field deleted successfully' });
  } catch (error) {
    console.error('Error deleting form field:', error);
    res.status(500).json({ error: 'Failed to delete form field' });
  }
});

// Get raffle settings
router.get('/raffle', async (req, res) => {
  try {
    let settings = await RaffleSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new RaffleSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching raffle settings:', error);
    res.status(500).json({ error: 'Failed to fetch raffle settings' });
  }
});

// Update raffle settings
router.put('/raffle', async (req, res) => {
  try {
    let settings = await RaffleSettings.findOne();
    if (!settings) {
      settings = new RaffleSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating raffle settings:', error);
    res.status(500).json({ error: 'Failed to update raffle settings' });
  }
});

// Get all participants (admin view with full data)
router.get('/participants', async (req, res) => {
  try {
    const participants = await Participant.find().sort({ submittedAt: -1 });
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Get admin users
router.get('/users', requireSuperAdmin, async (req, res) => {
  try {
    const users = await AdminUser.find().select('_id username role createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

// Create admin user
router.post('/users', requireSuperAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await AdminUser.findOne({ username: String(username).trim() });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const user = new AdminUser({
      username: String(username).trim(),
      passwordHash: 'temp',
      role: 'admin',
    });

    await user.setPassword(String(password));
    await user.save();

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// Delete admin user
router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.admin.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    if (user.role === 'superadmin') {
      return res.status(400).json({ error: 'Cannot delete superadmin account' });
    }

    await AdminUser.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return res.status(500).json({ error: 'Failed to delete admin user' });
  }
});

module.exports = router;
