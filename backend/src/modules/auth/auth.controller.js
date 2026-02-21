const authService = require("./auth.service");

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    if (result.requires2FA) {
      req.session.pending2FA = result.email;
      req.session.save((err) => {
        if (err) return next(err);
        return res.status(200).json({
          success: true,
          requires2FA: true
        });
      });
      return;
    }

    // Set HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, //process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      success: true,
      data: {
        user: result.user
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    })
  } catch (err) {
    next(err);
  }
};

exports.webauthnRegisterOptions = async (req, res, next) => {
  try {
    const userId = req.user.id; // dari middleware auth

    const options =
      await authService.generateWebAuthnRegisterOptions(userId);

    res.json(options);
  } catch (err) {
    next(err);
  }
};

exports.webauthnRegisterVerify = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result =
      await authService.verifyWebAuthnRegister(userId, req.body.credential);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.webauthnLoginOptions = async (req, res, next) => {
  try {
    const email = req.session.pending2FA;

    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized 2FA attempt"
      });
    }

    const options =
      await authService.generateWebAuthnLoginOptions(email);

    res.json(options);

  } catch (err) {
    next(err);
  }
};

exports.webauthnLoginVerify = async (req, res, next) => {
  try {
    const email = req.session.pending2FA;

    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized 2FA attempt"
      });
    }

    const { credential } = req.body;

    const result =
      await authService.verifyWebAuthnLogin(email, credential);

    // clear pending state
    req.session.pending2FA = null;

    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true });

  } catch (err) {
    next(err);
  }
};

exports.disable2FAOptions = async (req, res, next) => {
  try {
    const options =
      await authService.generateDisable2FAOptions(req.user.id);

    res.json(options);
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

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err);

    res.clearCookie("connect.sid", {
      path: "/",
      sameSite: "lax",
      secure: false
    });

    res.clearCookie("token", {
      path: "/",
      sameSite: "lax",
      secure: false
    });

    res.status(200).json({ success: true });
  });
};