const mongoose = require('mongoose');

const itemClaimSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  securityQuestion: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  claimSuccess: {
    type: Boolean,
    default: false,
  },
  claimProcessOngoing: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

const ItemClaim = mongoose.model('ItemClaim', itemClaimSchema);

module.exports = ItemClaim;
