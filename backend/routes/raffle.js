const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const RaffleSettings = require('../models/RaffleSettings');

// Get raffle info
router.get('/info', async (req, res) => {
  try {
    const settings = await RaffleSettings.findOne();
    const totalEntries = await Participant.countDocuments({ raffleEntry: true });
    const winners = await Participant.find({ hasWon: true });

    res.json({
      settings: settings || {},
      totalEntries,
      winners
    });
  } catch (error) {
    console.error('Error fetching raffle info:', error);
    res.status(500).json({ error: 'Failed to fetch raffle info' });
  }
});

// Draw winners
router.post('/draw', async (req, res) => {
  try {
    const settings = await RaffleSettings.findOne();
    if (!settings) {
      return res.status(404).json({ error: 'Raffle settings not found' });
    }

    const numberOfWinners = settings.numberOfWinners || 1;

    // Get all eligible participants (not already won)
    const eligibleParticipants = await Participant.find({
      raffleEntry: true,
      hasWon: false
    });

    if (eligibleParticipants.length === 0) {
      return res.status(400).json({ error: 'No eligible participants for raffle' });
    }

    if (eligibleParticipants.length < numberOfWinners) {
      return res.status(400).json({ 
        error: `Not enough participants. Need ${numberOfWinners}, have ${eligibleParticipants.length}` 
      });
    }

    // Randomly select winners using Fisher-Yates shuffle
    const shuffled = [...eligibleParticipants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedWinners = shuffled.slice(0, numberOfWinners);

    // Mark as winners
    for (const winner of selectedWinners) {
      winner.hasWon = true;
      await winner.save();
    }

    res.json({
      message: `${selectedWinners.length} winner(s) selected successfully!`,
      winners: selectedWinners
    });
  } catch (error) {
    console.error('Error drawing winners:', error);
    res.status(500).json({ error: 'Failed to draw winners' });
  }
});

// Get winners
router.get('/winners', async (req, res) => {
  try {
    const winners = await Participant.find({ hasWon: true });
    res.json(winners);
  } catch (error) {
    console.error('Error fetching winners:', error);
    res.status(500).json({ error: 'Failed to fetch winners' });
  }
});

module.exports = router;
