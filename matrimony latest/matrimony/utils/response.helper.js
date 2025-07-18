// File: utils/response.helper.js

const success = (res, message = "Success", data = {}) => {
  res.status(200).json({
    status: true,
    message,
    data,
  });
};

const error = (res, message = "Error", statusCode = 500, err = {}) => {
  res.status(statusCode).json({
    status: false,
    message,
    error: err,
  });
};

const sendErrorResponse = (res, statusCode, message, err) => {
  res.status(statusCode).json({
    status: false,
    message: message,
    error: err || (statusCode === 500 ? "Internal Server Error" : ""),
  });
};

module.exports = {
  success,
  error,
  sendErrorResponse,
};
