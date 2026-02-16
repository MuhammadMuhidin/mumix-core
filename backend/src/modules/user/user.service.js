const repo = require("./user.repository");

/**
 * USER SERVICE
 *
 * Scope:
 * - Menjalankan logika bisnis.
 * - Menentukan aturan domain (misalnya user harus ada, email unik, dsb).
 * - Mengatur alur proses sebelum/ sesudah akses data.
 * - Memanggil repository.
 *
 * Tidak boleh:
 * - Mengakses req/res.
 * - Menentukan format response HTTP.
 *
 * Role:
 * Pusat keputusan dan aturan sistem.
 */

exports.findAll = async () => repo.findAll();
exports.findById = async (id) => repo.findById(id);
exports.create = async (data) => repo.create(data);
exports.update = async (id, data) => repo.update(id, data);
exports.remove = async (id) => repo.remove(id);
