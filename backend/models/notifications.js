const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    unique: true,
    sparse: true,
  },
  chatId: {
    type: Schema.Types.ObjectId,
    unique: true,
    sparse: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['userVerification', 'itemVerification', 'itemDeletion','message', 'itemClaim'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
