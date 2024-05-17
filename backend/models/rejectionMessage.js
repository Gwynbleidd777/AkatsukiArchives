const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adminMessage: {
    type: String,
    required: true,
  },
  rejectionType: {
    type: String,
    enum: ["profileVerification", "itemPostingVerification"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RejectionMessage = mongoose.model("RejectionMessage", messageSchema);

module.exports = RejectionMessage;
