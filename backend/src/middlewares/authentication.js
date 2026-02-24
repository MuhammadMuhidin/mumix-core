const jwt = require("jsonwebtoken");
const AppError = require("../core/app.error");
const userRepo = require("../modules/user/user.repository");
const logger  = require("../core/logger");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  logger.fatal("JWT_SECRET is not defined");
  throw new Error("JWT_SECRET is not defined");
}

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      logger.warn({
        requestId: req.id,
        ip: req.ip,
        path: req.originalUrl
      }, "Missing authentication token");

      throw new AppError({
        statusCode: 401,
        code: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      logger.warn({
        requestId: req.id,
        ip: req.ip,
        path: req.originalUrl,
        error: err.name
      }, "Invalid or expired token");

      throw new AppError({
        statusCode: 401,
        code: err.name === "TokenExpiredError"
          ? "AUTH_EXPIRED"
          : "AUTH_INVALID",
        message: "Invalid or expired token",
      });
    }

    const user = await userRepo.findById(decoded.id);
    if (!user || !user.is_active ||
        Number(user.token_version) !== Number(decoded.tokenVersion)) {

      logger.warn({
        requestId: req.id,
        userId: decoded.id,
        ip: req.ip,
        path: req.originalUrl
      }, "Authentication failed");

      throw new AppError({
        statusCode: 401,
        code: "AUTH_FAILED",
        message: "Authentication failed",
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      webauthn_enabled: user.webauthn_enabled
    };

    next();
  } catch (err) {
    next(err);
  }
};