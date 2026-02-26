const authService = require("./auth.service");
const AppError = require("../../core/app.error");
const authEvents = require("../../observability/authEvents");

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

// --------------------
// Helpers
// --------------------

function setOtpSession(session, key, data) {
  session[key] = {
    email: data.email,
    otpHash: data.otpHash,
    expiresAt: data.expiresAt,
    attempts: 0,
    maxAttempts: data.maxAttempts
  };
}

// --------------------
// AUTH
// --------------------

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    if (result.requires2FA) {
      req.session.pending2FA = result.email;

      return req.session.save((err) => {
        if (err) return next(err);
        return res.json({ success: true, requires2FA: true });
      });
    }

    res.cookie("token", result.token, COOKIE_OPTIONS);
    authEvents.loginSuccess({ req, user: result.user });

    return res.json({
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
    return res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (err) {
    next(err);
  }
};

// --------------------
// ENABLE 2FA
// --------------------

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

    setOtpSession(req.session, "pendingEnable2FA", result);

    return req.session.save((err) => {
      if (err) return next(err);
      return res.json({ success: true, requiresOTP: true });
    });

  } catch (err) {
    next(err);
  }
};

// --------------------
// LOGIN 2FA
// --------------------

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

    const result =
      await authService.verifyWebAuthnLogin(
        email,
        req.body.credential
      );

    setOtpSession(req.session, "pendingOTP", result);

    return res.json({ success: true, requiresOTP: true });

  } catch (err) {
    next(err);
  }
};

// --------------------
// VERIFY OTP
// --------------------

exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;

    // ENABLE FLOW
    if (req.session.pendingEnable2FA) {
      const sessionData = req.session.pendingEnable2FA;

      if (sessionData.attempts >= sessionData.maxAttempts) {
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

        throw new AppError({
          statusCode: 401,
          code: "OTP_INVALID",
          message: "Invalid OTP"
        });
      }

      await authService.enable2FAAfterOtp(result.user.id);

      req.session.pendingEnable2FA = null;

      return res.json({ success: true, enable2FA: true });
    }

    // LOGIN FLOW
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

    const token = authService.generateAuthToken(result.user);

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
    await authService.disable2FAWithReauth(
      req.user.id,
      req.body.password,
      req.body.credential
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
    res.clearCookie("csrf_token", BASE_COOKIE_OPTIONS);

    authEvents.logoutSuccess({ req, user });

    return res.json({ success: true });
  });
};