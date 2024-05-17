const mongoose = require("mongoose");

const profileImageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: true,
    sparse: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const ProfileImage = mongoose.model("ProfileImage", profileImageSchema);

module.exports = ProfileImage;
