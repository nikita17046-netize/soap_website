const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(10);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notification (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { type, title, message, link, image } = req.body;
  try {
    const notification = new Notification({
      type, title, message, link, image
    });
    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notification (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      await notification.deleteOne();
      res.json({ message: 'Notification removed' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
