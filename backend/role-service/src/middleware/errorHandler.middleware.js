/**
 * Global Error Handler Middleware
 * Catches all errors and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('❌ Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let details = null;

  // Handle specific error types
  if (err.message) {
    message = err.message;
  }

  // Handle MySQL specific errors
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        statusCode = 409;
        message = 'Duplicate entry. Record already exists.';
        break;
      
      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        statusCode = 400;
        message = 'Referenced record does not exist.';
        break;
      
      case 'ER_ROW_IS_REFERENCED':
      case 'ER_ROW_IS_REFERENCED_2':
        statusCode = 409;
        message = 'Cannot delete record. It is referenced by other records (e.g., employees).';
        break;
      
      case 'ECONNREFUSED':
        statusCode = 503;
        message = 'Database connection refused. Please try again later.';
        break;
      
      case 'ETIMEDOUT':
        statusCode = 504;
        message = 'Database operation timed out. Please try again.';
        break;
      
      case 'ER_ACCESS_DENIED_ERROR':
        statusCode = 503;
        message = 'Database access denied. Please contact support.';
        break;
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Handle custom business logic errors
  if (err.message.includes('not found')) {
    statusCode = 404;
  }

  if (err.message.includes('already exists')) {
    statusCode = 409;
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    error: message
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = details || err.toString();
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
