const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const FormField = require('../models/FormField');
const { generateAvatar } = require('../utils/avatarGenerator');

// Get active form fields (public)
router.get('/fields', async (req, res) => {
  try {
    const fields = await FormField.find({ active: true }).sort({ order: 1 });
    res.json(fields);
  } catch (error) {
    console.error('Error fetching form fields:', error);
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
});

// Submit form
router.post('/submit', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    // Generate avatar
    const avatar = generateAvatar();

    // Create participant
    const participant = new Participant({
      formData,
      avatar,
      raffleEntry: true
    });

    await participant.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      participant: {
        id: participant._id,
        avatar: participant.avatar,
        submittedAt: participant.submittedAt
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get all participants (for display)
router.get('/', async (req, res) => {
  try {
    const participants = await Participant.find()
      .select('avatar submittedAt hasWon')
      .sort({ submittedAt: -1 });
    
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Get participant count
router.get('/count', async (req, res) => {
  try {
    const count = await Participant.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting participants:', error);
    res.status(500).json({ error: 'Failed to count participants' });
  }
});

module.exports = router;
