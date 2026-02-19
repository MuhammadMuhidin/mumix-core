const express = require("express");
const router = express.Router();
const ctrl = require("./user.controller");
const validator = require("./user.validator");
const { validate } = require("../../middlewares/validation");
const { authenticate } = require("../../middlewares/authentication");
const { authorize } = require("../../middlewares/authorization");
const { apiLimiter } = require("../../middlewares/rateLimit");

router.use(authenticate, authorize("admin"));

router.get("/", ctrl.findAll);
router.get("/:id", ctrl.findById);
router.post("/", apiLimiter, validate(validator.create), ctrl.create);
router.put("/:id", apiLimiter, validate(validator.update), ctrl.update);
router.delete("/:id", apiLimiter, ctrl.remove);

module.exports = router;
