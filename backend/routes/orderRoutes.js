const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// Create order
router.post('/', async (req, res) => {
  const { items, shippingInfo, total, userEmail } = req.body;
  
  // Note: user is optional for guest checkout
  const order = new Order({
    items,
    shippingInfo,
    total,
    status: 'Pending'
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// Get all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

// Get user orders
router.get('/myorders/:email', async (req, res) => {
  const orders = await Order.find({ 'shippingInfo.email': req.params.email }).sort({ createdAt: -1 });
  res.json(orders);
});

// Get order by ID (Track)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Invalid Order ID' });
  }
});

// Update order status (Admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

module.exports = router;
