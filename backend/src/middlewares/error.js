const logger = require('../config/logger');

// 9. Security & Error Handling
// Global error handler to prevent crashing and log the error.
const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message, err);

  res.status(500).json({
    message: 'Something went wrong on the server.',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
};

module.exports = errorMiddleware;
