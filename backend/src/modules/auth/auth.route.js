const express = require("express");
const controller = require("./auth.controller");
const { authenticate } = require("../../middlewares/authentication");
const { authLimiter } = require("../../middlewares/rateLimit");

const router = express.Router();

router.post("/login", authLimiter, controller.login);
router.get("/me", authenticate, controller.me);

module.exports = router;