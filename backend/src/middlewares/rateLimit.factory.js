const rateLimit = require("express-rate-limit");
const logger = require("../core/logger");

exports.createRateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests"
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
      logger.warn({
        requestId: req.id,
        ip: req.ip,
        path: req.originalUrl
      }, "Rate limit exceeded");

      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMITED",
          message
        }
      });
    }
  });
};