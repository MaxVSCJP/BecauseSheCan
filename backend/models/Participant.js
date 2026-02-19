const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  formData: {
    type: Map,
    of: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  raffleEntry: {
    type: Boolean,
    default: true
  },
  hasWon: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Participant', participantSchema);
