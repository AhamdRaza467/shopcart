const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
  process.exit(0);
}).catch(err => {
  console.error('Failed to connect to MongoDB Atlas. Error details:');
  console.error(err.message);
  if (err.message.includes('bad auth')) {
    console.error('-> The username or password in your MONGO_URI is incorrect.');
  } else if (err.message.includes('ENOTFOUND') || err.message.includes('timeout')) {
    console.error('-> This is usually caused by IP Whitelisting issues in MongoDB Atlas (Network Access).');
  }
  process.exit(1);
});
