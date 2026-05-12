const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aura_secret_123', { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  console.log('Register Request Received:', req.body);
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      console.log('User created successfully:', email);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login Request Received:', req.body.email);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log('Login successful:', email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update Wishlist
router.put('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.wishlist = req.body.wishlist; // Array of product IDs
      await user.save();
      res.json({ message: 'Wishlist updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = router;
