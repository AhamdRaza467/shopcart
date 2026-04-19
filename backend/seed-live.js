const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');
const User = require('./models/User');
const { products } = require('./seed/products.seed');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedLiveDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to LIVE MongoDB Atlas');

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding 20 products into LIVE database...');
      await Product.insertMany(products);
      console.log('Products seeded successfully!');
    } else {
      console.log(`Live DB already has ${productCount} products.`);
    }

    const adminExists = await User.findOne({ email: 'admin@shopcart.pk' });
    if (!adminExists) {
      console.log('Seeding Admin account into LIVE database...');
      await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@shopcart.pk',
        password: process.env.ADMIN_PASSWORD || 'secureadminpass123',
        role: 'admin'
      });
      console.log('Admin seeded successfully!');
    } else {
      console.log('Admin account already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding LIVE database:', error);
    process.exit(1);
  }
};

seedLiveDB();
