/**
 * APP PAGINATION
 *
 * Scope:
 * - Mengambil query pagination dari request (page, limit).
 * - Menghitung offset.
 * - Mengembalikan parameter yang siap digunakan service/repository.
 *
 * Tidak boleh:
 * - Mengakses database.
 * - Mengandung logika bisnis.
 *
 * Role:
 * Utility untuk kebutuhan pagination di layer HTTP.
 */

exports.getPagination = (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    return { page,limit, offset };

}
