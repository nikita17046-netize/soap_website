const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  weight: { type: String, default: '100g' },
  images: { type: [String], default: ['/soap-1.png'] }, // Changed to array
  stock: { type: Number, required: true, default: 0 },
  isOffer: { type: Boolean, default: false },
  offerLabel: { type: String },
  description: { type: String, default: '' },
  fullDescription: { type: String, default: '' },
  ingredients: { type: String, default: '' },
  benefits: { type: String, default: '' },
  ritual: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
