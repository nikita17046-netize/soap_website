const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    }
  ],
  shippingInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    paymentMethod: { type: String, required: true }
  },
  total: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, default: 'Pending' },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
