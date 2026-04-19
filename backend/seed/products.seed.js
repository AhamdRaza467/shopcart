const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  // ─── ELECTRONICS ───────────────────────────────────────────
  {
    name: 'Wireless Headphones',
    price: 8999,
    description:
      'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and remote workers.',
    category: 'Electronics',
    image: '/images/products/headphones.jpg',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: 'Bluetooth Speaker',
    price: 4999,
    description:
      'Portable Bluetooth speaker with 360° sound, IPX7 waterproof rating, and 20-hour playtime. Perfect for outdoor adventures.',
    category: 'Electronics',
    image: '/images/products/speaker.jpg',
    stock: 35,
    rating: 4.3,
    numReviews: 87,
  },
  {
    name: 'Smart Watch',
    price: 12999,
    description:
      'Feature-packed smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Compatible with iOS and Android.',
    category: 'Electronics',
    image: '/images/products/smartwatch.jpg',
    stock: 25,
    rating: 4.7,
    numReviews: 203,
  },
  {
    name: 'Phone Case',
    price: 999,
    description:
      'Military-grade drop protection phone case with a slim profile. Available for all major smartphone models. Shock-absorbing corners.',
    category: 'Electronics',
    image: '/images/products/phonecase.jpg',
    stock: 200,
    rating: 4.1,
    numReviews: 315,
  },
  {
    name: 'USB Hub',
    price: 2499,
    description:
      '7-in-1 USB-C hub with 4K HDMI, 100W PD charging, 2x USB 3.0, SD card reader, and Ethernet port. Expand your laptop connectivity.',
    category: 'Electronics',
    image: '/images/products/usbhub.jpg',
    stock: 40,
    rating: 4.4,
    numReviews: 62,
  },

  // ─── CLOTHING ──────────────────────────────────────────────
  {
    name: "Men's T-Shirt",
    price: 1499,
    description:
      'Premium cotton crew-neck t-shirt with a relaxed fit. Breathable, soft fabric perfect for everyday wear. Available in multiple colors.',
    category: 'Clothing',
    image: '/images/products/tshirt.jpg',
    stock: 150,
    rating: 4.2,
    numReviews: 441,
  },
  {
    name: "Women's Dress",
    price: 2999,
    description:
      'Elegant floral midi dress with a flattering silhouette. Made from lightweight chiffon fabric. Perfect for casual and semi-formal occasions.',
    category: 'Clothing',
    image: '/images/products/dress.jpg',
    stock: 80,
    rating: 4.6,
    numReviews: 189,
  },
  {
    name: 'Hoodie',
    price: 3499,
    description:
      'Cozy fleece hoodie with a kangaroo pocket and adjustable drawstring. Perfect for cool evenings and casual outings.',
    category: 'Clothing',
    image: '/images/products/hoodie.jpg',
    stock: 90,
    rating: 4.4,
    numReviews: 267,
  },
  {
    name: 'Jeans',
    price: 2799,
    description:
      'Classic slim-fit denim jeans with stretch comfort technology. Durable 98% cotton blend with modern cut for everyday style.',
    category: 'Clothing',
    image: '/images/products/jeans.jpg',
    stock: 120,
    rating: 4.3,
    numReviews: 352,
  },
  {
    name: 'Jacket',
    price: 5999,
    description:
      'Stylish puffer jacket with water-resistant outer shell and warm insulation. Features multiple pockets and a packable design.',
    category: 'Clothing',
    image: '/images/products/jacket.jpg',
    stock: 45,
    rating: 4.5,
    numReviews: 134,
  },

  // ─── SHOES ─────────────────────────────────────────────────
  {
    name: 'Running Shoes',
    price: 6999,
    description:
      'Lightweight running shoes with responsive foam cushioning and breathable mesh upper. Designed for long-distance comfort and performance.',
    category: 'Shoes',
    image: '/images/products/running_shoes.jpg',
    stock: 60,
    rating: 4.6,
    numReviews: 298,
  },
  {
    name: 'Casual Sneakers',
    price: 4499,
    description:
      'Versatile canvas sneakers with vulcanized rubber sole. The perfect everyday shoe that pairs with any outfit.',
    category: 'Shoes',
    image: '/images/products/sneakers.jpg',
    stock: 75,
    rating: 4.3,
    numReviews: 176,
  },
  {
    name: 'Formal Shoes',
    price: 5499,
    description:
      'Premium leather Oxford shoes with hand-stitched detailing. Polished finish and cushioned insole for all-day comfort.',
    category: 'Shoes',
    image: '/images/products/formal_shoes.jpg',
    stock: 30,
    rating: 4.4,
    numReviews: 93,
  },
  {
    name: 'Sports Shoes',
    price: 7999,
    description:
      'High-performance sports shoes with advanced ankle support and multi-surface traction. Ideal for basketball, tennis, and gym training.',
    category: 'Shoes',
    image: '/images/products/sports_shoes.jpg',
    stock: 55,
    rating: 4.7,
    numReviews: 412,
  },
  {
    name: 'Sandals',
    price: 1999,
    description:
      'Comfortable leather sandals with adjustable straps and cushioned footbed. Perfect for summer outings and beach walks.',
    category: 'Shoes',
    image: '/images/products/sandals.jpg',
    stock: 100,
    rating: 4.1,
    numReviews: 158,
  },

  // ─── ACCESSORIES ───────────────────────────────────────────
  {
    name: 'Leather Wallet',
    price: 1799,
    description:
      'Slim genuine leather bifold wallet with RFID blocking technology. 8 card slots, 2 bill compartments, and a sleek modern design.',
    category: 'Accessories',
    image: '/images/products/wallet.jpg',
    stock: 110,
    rating: 4.5,
    numReviews: 234,
  },
  {
    name: 'Sunglasses',
    price: 2299,
    description:
      'Polarized UV400 sunglasses with lightweight TR90 frame. Reduces glare and protects eyes. Includes hard case and cleaning cloth.',
    category: 'Accessories',
    image: '/images/products/sunglasses.jpg',
    stock: 85,
    rating: 4.4,
    numReviews: 167,
  },
  {
    name: 'Belt',
    price: 1299,
    description:
      'Genuine leather dress belt with classic pin buckle. Smooth finish, 3.5cm width. Available in brown and black.',
    category: 'Accessories',
    image: '/images/products/belt.jpg',
    stock: 140,
    rating: 4.2,
    numReviews: 89,
  },
  {
    name: 'Cap',
    price: 899,
    description:
      'Adjustable baseball cap with embroidered logo. Moisture-wicking sweatband and structured crown. One size fits all.',
    category: 'Accessories',
    image: '/images/products/cap.jpg',
    stock: 200,
    rating: 4.0,
    numReviews: 321,
  },
  {
    name: 'Backpack',
    price: 3999,
    description:
      '28L waterproof backpack with 15" laptop compartment, USB charging port, and multiple organizer pockets. Perfect for work and travel.',
    category: 'Accessories',
    image: '/images/products/backpack.jpg',
    stock: 65,
    rating: 4.6,
    numReviews: 278,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

module.exports = { products, seedProducts };

if (require.main === module) {
  seedProducts();
}
