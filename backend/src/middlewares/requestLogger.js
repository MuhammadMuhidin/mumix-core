const logger = require("../core/logger");
const { randomUUID } = require("crypto");

module.exports = (req, res, next) => {
  const start = Date.now();

  req.id = randomUUID();
  res.setHeader("X-Request-Id", req.id);

  res.on("finish", () => {
    const duration = Date.now() - start;

    const level =
      res.statusCode >= 500 ? "error" :
      res.statusCode >= 400 ? "warn" :
      "debug";

    logger[level]({
      requestId: req.id,
      sessionId: req.sessionID,
      userId: req.user?.id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
    }, "HTTP_REQUEST");
  });

  next();
};