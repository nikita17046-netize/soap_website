const mongoose = require('mongoose');

const aboutDetailSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['milestone', 'quest', 'botanical', 'stage']
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String, // E.g., origin location, badge label
    default: ''
  },
  value: {
    type: String, // E.g., stat number (15K+, 99%) or stage step (01, 02)
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, // SVG path or type identifier
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('AboutDetail', aboutDetailSchema);
