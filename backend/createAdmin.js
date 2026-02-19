const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/becauseshecan';

async function createAdmin() {
  const [, , usernameArg, passwordArg] = process.argv;

  if (!usernameArg || !passwordArg) {
    console.error('Usage: node createAdmin.js <username> <password>');
    process.exit(1);
  }

  const username = String(usernameArg).trim();
  const password = String(passwordArg);

  if (password.length < 8) {
    console.error('Password must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);

    const existingSuperadmin = await AdminUser.findOne({ role: 'superadmin' });
    if (existingSuperadmin) {
      console.error('A superadmin already exists. New admin accounts must be created by the superadmin from the dashboard.');
      process.exit(1);
    }

    const existingUser = await AdminUser.findOne({ username });
    if (existingUser) {
      console.error(`Admin user "${username}" already exists.`);
      process.exit(1);
    }

    const admin = new AdminUser({
      username,
      passwordHash: 'temp',
      role: 'superadmin',
    });

    await admin.setPassword(password);
    await admin.save();

    console.log(`Superadmin "${username}" created successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();
