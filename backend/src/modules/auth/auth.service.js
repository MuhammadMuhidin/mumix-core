const userRepo = require("../user/user.repository");
const AppError = require("../../core/app.error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.is_active) {
    throw new AppError("Account disabled", 403);
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      tokenVersion: Number(user.token_version)
    },
    JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};