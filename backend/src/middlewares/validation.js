const AppError = require("../core/app.error");
const logger = require("../core/logger");

exports.validate = (validator) => async (req, res, next) => {
  try {
    await validator.validate(req.body);
    next();
  } catch (err) {
    logger.warn({
      requestId: req.id,
      path: req.originalUrl,
      method: req.method,
      error: err.message,
    }, "Validation failed");

    next(new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: err.message,
    }));
  }
};