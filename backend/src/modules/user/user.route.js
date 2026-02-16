const express = require("express");
const router = express.Router();
const ctrlUser = require("./user.controller");

router.get("/", ctrlUser.findAll);
router.get("/:id", ctrlUser.findById);
router.post("/", ctrlUser.create);
router.put("/:id", ctrlUser.update);
router.delete("/:id", ctrlUser.remove);

module.exports = router;