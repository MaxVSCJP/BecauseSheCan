const mongoose = require('mongoose');

const raffleSettingsSchema = new mongoose.Schema({
  prize: {
    type: String,
    required: true,
    default: 'Grand Prize'
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  drawDate: {
    type: Date,
    default: null
  },
  numberOfWinners: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RaffleSettings', raffleSettingsSchema);
