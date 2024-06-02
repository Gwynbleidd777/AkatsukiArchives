const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  itemType: { type: String, required: true },
  securityQuestion: { type: String, required: true },
  lostFoundDate: { type: Date, required: true },
  datePosted: { type: Date, default: Date.now },
  mainImage: { type: String, required: true },
  additionalImages: [{ type: String }],
  brand: { type: String },
  itemColor: { type: String, default: 'Others' },
  mainImageEmbedding: { type: [Number], required: true },
  additionalImagesEmbeddings: { type: [[Number]], default: [] },
  claimed: { type: String, default: 'unclaimed' },
  verified: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
