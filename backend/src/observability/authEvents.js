const logger = require("../core/logger");

exports.loginSuccess = ({ req, user }) => {
  logger.info({
    requestId: req.id,
    sessionId: req.sessionID,
    userId: user.id,
    ip: req.ip,
  }, "LOGIN_SUCCESS");
};

exports.logoutSuccess = ({ req, user }) => {
  logger.info({
    requestId: req.id,
    sessionId: req.sessionID,
    userId: user.id,
    ip: req.ip,
  }, "LOGOUT_SUCCESS");
};

exports.loginFailed = ({ req, email }) => {
  logger.warn({
    requestId: req.id,
    sessionId: req.sessionID,
    email,
    ip: req.ip,
  }, "LOGIN_FAILED");
};

exports.otpFailed = ({ req, email }) => {
  logger.warn({
    requestId: req.id,
    sessionId: req.sessionID,
    email,
    ip: req.ip,
  }, "OTP_FAILED");
};

exports.otpLocked = ({ req, email }) => {
  logger.error({
    requestId: req.id,
    sessionId: req.sessionID,
    email,
    ip: req.ip,
  }, "OTP_LOCKED");
};