const logger = require("./logger");

class CustomError extends Error {
  constructor(message, statusCode = 400, name = "Error", details = []) {
    super(message);
    this.name = name; 
    this.statusCode = statusCode;
    this.details = details; 
    Error.captureStackTrace(this, this.constructor); 
  }
}

const errorHandler = (err, req, res, next) => {
  // Log the error message & stack trace with additional context
  logger.error(`Error: ${err.message} - Stack Trace: ${err.stack}`);
  logger.warn(`Status Code: ${err.statusCode}`);

  // Status code & message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  //JSON response with status and message
  const response = {
    message, 
  };

  if (statusCode === 500 || err.name !== "Error") {
    response.error = statusCode === 500 ? "Internal Server Error" : err.name; // Custom error message
  }

  res.status(statusCode).json(response);
};

// Custom Error Handler
const handleServiceError = (
  error,
  logger,
  defaultMessage = "An unexpected error occurred",
) => {
  if (error instanceof CustomError) {
    logger.warn(`[Service] Custom error: ${error.message}`);
    throw error;
  } else {
    logger.error(`[Service] Unexpected error: ${error.message}`);
    throw new CustomError(defaultMessage, 500);
  }
};

module.exports = {
  CustomError,
  errorHandler,
  handleServiceError,
};
