const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Get single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Create product (Admin)
router.post('/', protect, admin, async (req, res) => {
  const { name, price, originalPrice, category, stock, isOffer, offerLabel, images, description, fullDescription, ingredients, benefits, ritual, weight } = req.body;
  const product = new Product({ 
    name, price, originalPrice, category, stock, isOffer, offerLabel, images, 
    description, fullDescription, ingredients, benefits, ritual, weight 
  });
  const createdProduct = await product.save();

  // Create notification for new product
  try {
    await Notification.create({
      type: 'PRODUCT_ADD',
      title: 'New Ritual Added!',
      message: `${name} has been added to our collection.`,
      link: `/shop/product/${createdProduct._id}`,
      image: images?.[0] || '/soap-1.png'
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }

  res.status(201).json(createdProduct);
});

// Update product (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (updatedProduct) {
      // Create notification if it's a new offer
      if (req.body.isOffer) {
        try {
          await Notification.create({
            type: 'PRODUCT_ADD',
            title: 'New Deal Alert!',
            message: `Special offer on ${updatedProduct.name}: ${updatedProduct.offerLabel || 'Limited time deal!'}`,
            link: `/shop/product/${updatedProduct._id}`,
            image: updatedProduct.images?.[0] || '/soap-1.png'
          });
        } catch (err) {
          console.error('Failed to create notification:', err);
        }
      }
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    // Check if ID is a valid MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format. Static products cannot be deleted from database.' });
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
