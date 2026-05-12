const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/authMiddleware');

// Send message
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  const newMessage = new Message({ name, email, subject, message });
  const savedMessage = await newMessage.save();
  res.status(201).json(savedMessage);
});

// Get all messages (Admin)
router.get('/', protect, admin, async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

// Get unread replies for user
router.get('/user/:email', async (req, res) => {
  const messages = await Message.find({ email: req.params.email }).sort({ createdAt: -1 });
  res.json(messages);
});

// Admin Reply
router.put('/:id/reply', protect, admin, async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (message) {
    const replyText = `ADMIN: ${req.body.reply}`;
    if (message.reply) {
      message.reply = `${message.reply}|NEXT|${replyText}`;
    } else {
      message.reply = replyText;
    }
    message.status = 'Read';
    message.userSeen = false;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});

// User Follow-up
router.put('/:id/user-reply', async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (message) {
    const replyText = `USER: ${req.body.text}`;
    if (message.reply) {
      message.reply = `${message.reply}|NEXT|${replyText}`;
    } else {
      message.reply = replyText;
    }
    message.status = 'Unread'; // Alert admin
    message.userSeen = true;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});

// User Mark Seen
router.put('/user/:email/seen', async (req, res) => {
  await Message.updateMany(
    { email: req.params.email, reply: { $exists: true } },
    { $set: { userSeen: true } }
  );
  res.json({ message: 'Marked as seen' });
});

module.exports = router;
