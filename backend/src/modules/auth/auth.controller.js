const authService = require("./auth.service");

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

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
