const { Pool } = require("pg");

/**
 * DATABASE CONFIGURATION
 *
 * Scope:
 * - Membuat dan mengkonfigurasi koneksi database (Pool).
 * - Mengekspor instance koneksi untuk digunakan repository.
 *
 * Tidak boleh:
 * - Mengandung logika bisnis.
 * - Mengandung query.
 * - Mengatur response HTTP.
 *
 * Role:
 * Infrastructure layer untuk koneksi database.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
