const jwt = require("jsonwebtoken");
const AppError = require("../core/app.error");
const userRepo = require("../modules/user/user.repository");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

exports.verifyToken = async (req, res, next) => {
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

    req.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
};