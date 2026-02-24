const authService = require("./auth.service");
const AppError = require("../../core/app.error");
const authEvents = require("../../observability/authEvents");
const jwt = require("jsonwebtoken");

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

const COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: 24 * 60 * 60 * 1000
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    if (result.requires2FA) {
      req.session.pending2FA = result.email;

      return req.session.save((err) => {
        if (err) return next(err);
        return res.status(200).json({
          success: true,
          requires2FA: true
        });
      });
    }

    res.cookie("token", result.token, COOKIE_OPTIONS);

    authEvents.loginSuccess({ req, user: result.user });

    return res.status(200).json({
      success: true,
      data: { user: result.user }
    });
  } catch (err) {
    authEvents.loginFailed({ req, email: req.body.email });
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: { user: req.user }
    });
  } catch (err) {
    next(err);
  }
};

exports.webauthnRegisterOptions = async (req, res, next) => {
  try {
    const options =
      await authService.generateWebAuthnRegisterOptions(req.user.id);

    return res.json(options);
  } catch (err) {
    next(err);
  }
};

exports.webauthnRegisterVerify = async (req, res, next) => {
  try {
    const result =
      await authService.verifyWebAuthnRegister(
        req.user.id,
        req.body.credential
      );

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.webauthnLoginOptions = async (req, res, next) => {
  try {
    const email = req.session.pending2FA;

    if (!email) {
      throw new AppError({
        statusCode: 403,
        code: "2FA_UNAUTHORIZED",
        message: "Unauthorized 2FA attempt"
      });
    }

    const options =
      await authService.generateWebAuthnLoginOptions(email);

    return res.json(options);
  } catch (err) {
    next(err);
  }
};

exports.webauthnLoginVerify = async (req, res, next) => {
  try {
    const email = req.session.pending2FA;

    if (!email) {
      throw new AppError({
        statusCode: 403,
        code: "2FA_UNAUTHORIZED",
        message: "Unauthorized 2FA attempt"
      });
    }

    const { credential } = req.body;

    const result =
      await authService.verifyWebAuthnLogin(email, credential);

    req.session.pendingOTP = {
      email: result.email,
      otpHash: result.otpHash,
      expiresAt: result.expiresAt,
      attempts: 0,
      maxAttempts: result.maxAttempts
    };

    return res.json({ success: true, requiresOTP: true });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const sessionData = req.session.pendingOTP;

    if (!sessionData) {
      throw new AppError({
        statusCode: 403,
        code: "OTP_SESSION_MISSING",
        message: "Unauthorized OTP attempt"
      });
    }

    if (sessionData.attempts >= sessionData.maxAttempts) {
      authEvents.otpLocked({ req, email: sessionData.email });
      throw new AppError({
        statusCode: 403,
        code: "OTP_ATTEMPTS_EXCEEDED",
        message: "Maximum OTP attempts exceeded"
      });
    }

    const result =
      await authService.validateOtp(sessionData, otp);

    if (!result.valid) {
      sessionData.attempts += 1;

      authEvents.otpFailed({ req, email: sessionData.email });
      throw new AppError({
        statusCode: 401,
        code: "OTP_INVALID",
        message: "Invalid OTP"
      });
    }

    const token = jwt.sign(
      {
        id: result.user.id,
        role: result.user.role,
        tokenVersion: Number(result.user.token_version)
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    req.session.pendingOTP = null;
    req.session.pending2FA = null;

    res.cookie("token", token, COOKIE_OPTIONS);

    authEvents.loginSuccess({ req, user: result.user });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.disable2FAOptions = async (req, res, next) => {
  try {
    const options =
      await authService.generateDisable2FAOptions(req.user.id);

    return res.json(options);
  } catch (err) {
    next(err);
  }
};

exports.disable2FAVerify = async (req, res, next) => {
  try {
    const { password, credential } = req.body;

    await authService.disable2FAWithReauth(
      req.user.id,
      password,
      credential
    );

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  const user = req.user;
  
  req.session.destroy((err) => {
    if (err) return next(err);

    res.clearCookie("connect.sid", BASE_COOKIE_OPTIONS);
    res.clearCookie("token", BASE_COOKIE_OPTIONS);

    authEvents.logoutSuccess({ req, user });
    return res.status(200).json({ success: true });
  });
};