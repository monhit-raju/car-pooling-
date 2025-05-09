const jwt = require('jsonwebtoken');

// Use environment variable instead of hardcoded secret
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ detail: 'No token, authorization denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user ID to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ detail: 'Token is not valid' });
  }
};
