const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// 4. Authentication & Authorization
// Middleware to protect routes and verify JWT token.
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    logger.warn('Access denied. No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains user_id, role, etc.
    next();
  } catch (ex) {
    logger.error('Invalid token attempt.');
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Forbidden access attempt by user ${req.user.user_id}`);
      return res.status(403).json({ message: 'Forbidden. You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
