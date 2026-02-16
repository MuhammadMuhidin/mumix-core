const express = require("express");
const router = express.Router();
const ctrl = require("./user.controller");
const { validate } = require("../../middlewares/validate.middleware");
const validator = require("./user.validator");

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

router.get("/", ctrl.findAll);
router.get("/:id", ctrl.findById);
router.post("/", validate(validator.create), ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
