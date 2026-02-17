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

const repo = require("./user.repository");
const AppError = require("../../core/app.error");
const bcrypt = require("bcrypt");

exports.findAll = async () => repo.findAll();
exports.findById = async (id) => repo.findById(id);

exports.create = async (data) => {
    if (await repo.findByEmail(data.email)) {
        throw new AppError("Email already exists", 400);
    }

    data.password = await bcrypt.hash(data.password, 10);
    return repo.create(data);
}

exports.update = async (id, data) => repo.update(id, data);
exports.remove = async (id) => repo.remove(id);
