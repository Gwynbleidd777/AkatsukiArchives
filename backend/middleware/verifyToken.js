const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.error("Access denied. Token is missing.");
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1];
    
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    req.user = decoded.userId;
    console.log('User ID extracted from token:', req.user);
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
