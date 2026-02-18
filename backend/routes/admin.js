const express = require('express');
const router = express.Router();
const FormField = require('../models/FormField');
const RaffleSettings = require('../models/RaffleSettings');
const Participant = require('../models/Participant');

// Get all form fields
router.get('/fields', async (req, res) => {
  try {
    const fields = await FormField.find({ active: true }).sort({ order: 1 });
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
      { new: true, runValidators: true }
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

module.exports = router;
