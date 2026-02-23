const { createRateLimit } = require("./rateLimit.factory");

exports.apiLimiter = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

exports.authLimiter = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later."
});

exports.otpLimiter = createRateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later."
});