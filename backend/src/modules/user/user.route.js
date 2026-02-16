const express = require("express");
const router = express.Router();
const ctrl = require("./user.controller");
const { validate } = require("../../middlewares/validate.middleware");
const validator = require("./user.validator");

router.get("/", ctrl.findAll);
router.get("/:id", ctrl.findById);
router.post("/", validate(validator.create), ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;