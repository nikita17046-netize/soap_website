const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String },
  status: { type: String, default: 'Unread' },
  userSeen: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
