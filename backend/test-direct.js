const mongoose = require('mongoose');

const uri = 'mongodb://shopcartuser:shopcart09ahmad@ac-hdo6wkb-shard-00-01.wcobjpb.mongodb.net:27017,ac-hdo6wkb-shard-00-00.wcobjpb.mongodb.net:27017,ac-hdo6wkb-shard-00-02.wcobjpb.mongodb.net:27017/shopcart?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('SUCCESSFULLY CONNECTED USING DIRECT STRING!');
  process.exit(0);
}).catch(err => {
  console.error('Failed to connect:', err.message);
  process.exit(1);
});
