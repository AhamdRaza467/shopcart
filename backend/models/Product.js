const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Clothing', 'Shoes', 'Accessories'],
    },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
