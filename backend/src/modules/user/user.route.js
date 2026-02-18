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
const { validate } = require("../../middlewares/validation");
const { authenticate } = require("../../middlewares/authentication");
const { authorize } = require("../../middlewares/authorization");

router.use(authenticate, authorize("admin"));

router.get("/", ctrl.findAll);
router.get("/:id", ctrl.findById);
router.post("/", validate(validator.create), ctrl.create);
router.put("/:id", validate(validator.update), ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
