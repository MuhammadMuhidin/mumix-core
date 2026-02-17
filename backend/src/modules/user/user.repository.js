/**
 * USER REPOSITORY
 *
 * Scope:
 * - Berinteraksi langsung dengan database.
 * - Menjalankan query CRUD.
 * - Mengembalikan data mentah dari database.
 *
 * Tidak boleh:
 * - Mengandung logika bisnis.
 * - Mengurus response HTTP.
 * - Menentukan aturan domain.
 *
 * Role:
 * Data access layer (akses penyimpanan data).
 */

const BaseRepository = require("../../core/base.repository");

const table = "users";
const allowFields = ["name", "email", "phone", "password", "is_active"];

class UserRepository extends BaseRepository {
    constructor() {
        super(table, allowFields);
    }
}

module.exports = new UserRepository();
