/**
 * USER ROUTE
 *
 * Scope (Apa yang boleh dilakukan):
 * - Mendefinisikan endpoint HTTP (GET, POST, PUT, DELETE).
 * - Menghubungkan route ke validator dan controller.
 * - Menentukan urutan middleware.
 *
 * Tidak boleh:
 * - Mengandung logika bisnis.
 * - Mengakses database.
 * - Mengolah data.
 *
 * Role:
 * Route hanya bertugas sebagai wiring layer (penghubung).
 */

const express = require("express");
const router = express.Router();
const ctrl = require("./user.controller");
const validator = require("./user.validator");
const { validate } = require("../../middlewares/validate.middleware");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.get("/", verifyToken ,ctrl.findAll);
router.get("/:id", verifyToken,ctrl.findById);
router.post("/", verifyToken,validate(validator.create), ctrl.create);
router.put("/:id", verifyToken, ctrl.update);
router.delete("/:id", verifyToken, ctrl.remove);

module.exports = router;
