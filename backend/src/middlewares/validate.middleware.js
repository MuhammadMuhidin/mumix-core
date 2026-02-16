const AppError = require("../core/app.error");

/**
 * VALIDATE MIDDLEWARE
 *
 * Scope:
 * - Menjalankan validasi schema (Joi).
 * - Menghentikan request jika format input tidak valid.
 * - Meneruskan request ke controller jika valid.
 *
 * Tidak boleh:
 * - Mengecek kondisi database.
 * - Mengandung aturan bisnis.
 *
 * Role:
 * Menjaga integritas format data sebelum masuk ke sistem.
 */

exports.validate = (validator) => async (req, res, next) => {
    try {
        await validator.validate(req.body);
        next();
    } catch (err) {
        next(new AppError(err.message, 400));
    }

};
