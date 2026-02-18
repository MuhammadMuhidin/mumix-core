/**
 * USER VALIDATOR
 *
 * Scope:
 * - Memvalidasi struktur dan format input menggunakan Joi.
 * - Mengecek required field, tipe data, format email, panjang string, dsb.
 * - Mengembalikan error jika format tidak valid.
 *
 * Tidak boleh:
 * - Mengecek kondisi database.
 * - Mengandung logika bisnis (misalnya cek email sudah terdaftar).
 * - Mengakses repository.
 *
 * Role:
 * Menjaga agar data yang masuk ke sistem sudah valid secara format.
 */

const joi = require("joi");

exports.create = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    password: joi.string().min(6).required()

});

exports.update = joi.object({
  name: joi.string().optional(),
  email: joi.string().email().optional(),
  phone: joi.string().optional(),
  password: joi.string().min(6).optional(),
  is_active: joi.boolean().optional(),
  role: joi.string().valid("admin", "user").optional()
});