const express = require("express");
const controller = require("./auth.controller");
const authController = require("./auth.controller");
const { authenticate } = require("../../middlewares/authentication");
const { authLimiter } = require("../../middlewares/rateLimit");

const router = express.Router();

router.post("/login", authLimiter, controller.login);
router.get("/me", authenticate, controller.me);

router.post("/webauthn/register/options", authenticate, authController.webauthnRegisterOptions);
router.post("/webauthn/register/verify", authenticate, authController.webauthnRegisterVerify);

router.post("/webauthn/login/options", authController.webauthnLoginOptions);
router.post("/webauthn/login/verify", authController.webauthnLoginVerify);

router.post("/webauthn/disable/options", authenticate, authController.disable2FAOptions);
router.post("/webauthn/disable/verify", authenticate, authController.disable2FAVerify);

router.post("/logout", authController.logout);

module.exports = router;