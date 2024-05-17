const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otpRoutes');
const adminRoutes = require('./routes/admin')

app.use('/api/auth', authRoutes);
app.use('/api/otpRoutes', otpRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/login-success', async (req, res) => {
  try {
    const token = req.body.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
