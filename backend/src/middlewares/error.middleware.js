/**
 * GLOBAL ERROR MIDDLEWARE
 *
 * Scope:
 * - Menangkap semua error yang dilempar dari controller/service.
 * - Menentukan format response error yang konsisten.
 * - Mengirim status code dan message ke client.
 *
 * Tidak boleh:
 * - Mengandung logika bisnis.
 * - Mengakses database.
 * - Mengubah alur domain.
 *
 * Role:
 * Centralized error handler untuk seluruh aplikasi.
 */

exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

};
