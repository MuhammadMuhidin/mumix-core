const rateLimit = require("express-rate-limit");

exports.createRateLimit = ({
  windowMs = 15 * 60 * 1000, // 15 menit
  max = 100, // 100 request
  message = "Too many requests, please try again later."
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message
    }
  });
};
