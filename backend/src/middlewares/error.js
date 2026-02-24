const logger = require("../core/logger");

exports.errorHandler = (err, req, res, next) => {
  logger.error({
    requestId: req.id,
    sessionId: req.sessionID,
    userId: req.user?.id,
    stack: err.stack,
  }, err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message,
    },
  });
};