/**
 * APP RESPONSE
 *
 * Scope:
 * - Helper untuk mengirim response sukses atau gagal.
 * - Menstandarisasi format JSON response.
 *
 * Tidak boleh:
 * - Mengandung logika bisnis.
 * - Mengakses database.
 *
 * Role:
 * Menjaga konsistensi format response HTTP.
 */

exports.success = (res, data, status = 200) => {
    res.status(status).json({
        success:true,
        data
    });
}

exports.error = (res, message, status = 400) => {
    res.status(status).json({
        success:false,
        message
    });

}
