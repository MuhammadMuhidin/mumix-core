const crypto = require("crypto");

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function setCSRFCookie(req, res, next) {
  const existing = req.cookies?.[CSRF_COOKIE_NAME];

  if (!existing) {
    const token = generateToken();

    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // HARUS false agar FE bisa baca
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  next();
}

function verifyCSRF(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token missing",
    });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }

  next();
}

module.exports = {
  setCSRFCookie,
  verifyCSRF,
};