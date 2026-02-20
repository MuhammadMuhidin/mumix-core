const BaseRepository = require("../../core/base.repository");
const pool = require("../../config/db");

const table = "users";
const searchableFields = ["name", "email"]
const allowFields = [
  "name",
  "email",
  "phone",
  "is_active",
  "token_version",
  "role",
  "webauthn_enabled",
  "webauthn_credential_id",
  "webauthn_public_key",
  "webauthn_counter",
  "webauthn_current_challenge"
];
const selectFields = [
  "id",
  "name",
  "email",
  "phone",
  "is_active",
  "token_version",
  "role",
  "webauthn_enabled",
  "webauthn_credential_id",
  "webauthn_public_key",
  "webauthn_counter",
  "webauthn_current_challenge",
  "created_at",
  "updated_at"
];

class UserRepository extends BaseRepository {
    constructor() {
        super(table, allowFields, selectFields, searchableFields);
    }

    async findByEmail(email) {
        const { rows } = await pool.query(
            `SELECT ${this.selectFields}, password
            FROM ${this.table} WHERE email = $1`,
            [email]
        );
        return rows[0] || null;
    }
}

module.exports = new UserRepository();