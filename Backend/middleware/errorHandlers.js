const errorHandler = (err, req, res, next) => {
  // Log error stack to console for debugging
  console.error(`❌ Error: ${err.message}`);

  // Use existing status code or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
