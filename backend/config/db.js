const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// We require the products array from the seed script to seed the memory DB
const { products } = require('../seed/products.seed');
const Product = require('../models/Product');
const User = require('../models/User'); // In case we want to seed an admin user too

const connectDB = async () => {
  try {
    // Attempt to connect to the provided MongoDB URI first
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000, // Timeout fast so we can fallback
    });
    console.log(`✅ MongoDB Connected (Local/Cloud): ${conn.connection.host}`);
  } catch (error) {
    console.log(`⚠️  Failed to connect to Local MongoDB. Falling back to In-Memory Database...`);
    
    try {
      // Start in-memory server
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      
      // Seed products into the in-memory database
      console.log('🌱 Seeding products into In-Memory Database...');
      await Product.insertMany(products);
      console.log(`✅ Seeded ${products.length} products!`);

      // Seed a default admin user for demo purposes
      const adminExists = await User.findOne({ email: 'admin@shopcart.pk' });
      if (!adminExists) {
        await User.create({
          name: 'Admin User',
          email: 'admin@shopcart.pk',
          password: 'admin123',
          role: 'admin'
        });
        console.log(`✅ Seeded default admin user!`);
      }
      
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB Connection Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
