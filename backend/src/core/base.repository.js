const pool = require("../config/db");

class BaseRepository {
  constructor(table, allowedFields) {
    this.table = table;
    this.allowedFields = allowedFields;
  }

  filterAllowedFields(data) {
    return Object.keys(data).filter((key) =>
      this.allowedFields.includes(key)
    );
  }

  async findAll() {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.table}`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async create(data) {
    const keys = this.filterAllowedFields(data);

    if (keys.length === 0) {
      throw new Error("No valid fields provided for insert");
    }

    const values = keys.map((key) => data[key]);
    const columns = keys.join(", ");
    const placeholders = keys
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const query = `
      INSERT INTO ${this.table} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async update(id, data) {
    const keys = this.filterAllowedFields(data);

    if (keys.length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const values = keys.map((key) => data[key]);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE ${this.table}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  }

  async remove(id) {
    await pool.query(
      `DELETE FROM ${this.table} WHERE id = $1`,
      [id]
    );
  }
}

module.exports = BaseRepository;