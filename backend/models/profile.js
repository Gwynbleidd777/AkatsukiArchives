const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  address: String,
  phoneNumber: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Others', 'Prefer Not To Say'],
  },
  idType: {
    type: String,
    enum: ['Aadhaar Card', 'Voter Card', 'Pan Card', 'Others'],
  },
  idNumber: String,
  idImageUrl: String,
  idFileName: String, // New field for storing the file name
});

module.exports = mongoose.model('Profile', profileSchema);
