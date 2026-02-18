const jwt = require("jsonwebtoken");
const AppError = require("../core/app.error");
const userRepo = require("../modules/user/user.repository");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepo.findById(decoded.id);
    if (!user) {
      throw new AppError("User not found", 401);
    }

    // 🔒 Token version check
    if (Number(user.token_version) !== Number(decoded.tokenVersion)) {
      throw new AppError("Session expired", 401);
    }

    // 🔒 Account status check
    if (!user.is_active) {
      throw new AppError("Account disabled", 403);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    next(err);
  }
};