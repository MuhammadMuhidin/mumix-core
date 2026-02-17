/**
 * APP ERROR
 *
 * Scope:
 * - Custom error class untuk domain dan aplikasi.
 * - Menyimpan message dan statusCode.
 * - Digunakan oleh service/controller untuk melempar error terstruktur.
 *
 * Tidak boleh:
 * - Mengirim response langsung.
 * - Mengandung logika bisnis.
 *
 * Role:
 * Representasi error terstandarisasi di dalam sistem.
 */

class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = AppError;