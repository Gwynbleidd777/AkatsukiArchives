const express = require('express');
const router = express.Router();
const sendOTP = require('../utils/otp');

const storedOTPs = {};

router.post('/generate-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpString = otp.toString();

    storedOTPs[email] = otpString;

    await sendOTP(email, otpString);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Failed to generate OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.body;

    console.log("Entered OTP:", otp); // Add this console log
    console.log("Stored OTP:", storedOTPs[email]); // Add this console log

    const storedOTP = storedOTPs[email];

    if (otp === storedOTP) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});


module.exports = router;
