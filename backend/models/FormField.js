const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'email', 'number', 'select', 'textarea'],
    default: 'text'
  },
  options: [String], // For select fields
  required: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FormField', formFieldSchema);
