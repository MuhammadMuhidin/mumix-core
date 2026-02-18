const AppError = require("../core/app.error");

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }
    
    next();
  };
};
