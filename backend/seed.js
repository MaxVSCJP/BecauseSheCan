const mongoose = require('mongoose');
const FormField = require('./models/FormField');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/becauseshecan';

const defaultFields = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    order: 1
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    order: 2
  },
  {
    name: 'skillLevel',
    label: 'Skill Level',
    type: 'select',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true,
    order: 3
  },
  {
    name: 'interests',
    label: 'Areas of Interest',
    type: 'textarea',
    required: false,
    order: 4
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');

    // Clear existing form fields
    await FormField.deleteMany({});
    console.log('Cleared existing form fields');

    // Insert default fields
    await FormField.insertMany(defaultFields);
    console.log('Inserted default form fields');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
