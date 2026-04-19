const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('SUCCESSFULLY CONNECTED USING BYPASS STRING!');
  process.exit(0);
}).catch(err => {
  console.error('Failed to connect:', err.message);
  process.exit(1);
});
