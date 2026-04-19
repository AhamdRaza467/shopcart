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
      email: 'admin@shopcart.com',
      password: 'password123',
      role: 'admin'
    });

    await admin.save();
    console.log('Default Admin user created successfully:');
    console.log('Email: admin@shopcart.com');
    console.log('Password: password123');

    // Disconnect and exit
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error wiping users:', error);
    process.exit(1);
  }
};

wipeUsers();
