const BaseRepository = require("../../core/base.repository");
const pool = require("../../config/db");

const table = "users";
const allowFields = ["name", "email", "phone", "password", "is_active", "token_version", "role" ];
const searchableFields = ["name", "email"];
const selectFields = [
  "id",
  "name",
  "email",
  "phone",
  "is_active",
  "token_version",
  "role",
  "created_at",
  "updated_at"
];

class UserRepository extends BaseRepository {
    constructor() {
        super(table, allowFields, selectFields, searchableFields);
    }

    async findByEmail(email) {
        const { rows } = await pool.query(
            `SELECT id, email, password, role, token_version, is_active
            FROM ${this.table} WHERE email = $1`,
            [email]
        );
        return rows[0] || null;
    }
}

module.exports = new UserRepository();