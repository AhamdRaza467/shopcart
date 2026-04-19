require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const wipeUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database');

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users.`);

    // Create a new default admin user
    const admin = new User({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@shopcart.com',
      password: process.env.ADMIN_PASSWORD || 'secureadminpass123',
      role: 'admin'
    });

    await admin.save();
    console.log('Default Admin user created successfully.');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@shopcart.com'}`);
    console.log('Password: [Check your .env ADMIN_PASSWORD or use default]');

    // Disconnect and exit
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error wiping users:', error);
    process.exit(1);
  }
};

wipeUsers();
