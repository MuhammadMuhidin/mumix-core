const AppError = require("../core/app.error");
const logger = require("../core/logger");

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError({
        statusCode: 401,
        code: "AUTH_REQUIRED",
        message: "Unauthorized"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn({
        requestId: req.id,
        userId: req.user.id,
        role: req.user.role,
        path: req.originalUrl
      }, "Forbidden access attempt");

      throw new AppError({
        statusCode: 403,
        code: "FORBIDDEN",
        message: "Forbidden"
      });
    }

    next();
  };
};