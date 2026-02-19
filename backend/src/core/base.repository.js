const pool = require("../config/db");

class BaseRepository {
  constructor(table, allowedFields, searchableFields = []) {
    this.table = table;
    this.allowedFields = allowedFields;
    this.searchableFields = searchableFields;
  }

  filterAllowedFields(data) {
    return Object.keys(data).filter((key) =>
      this.allowedFields.includes(key)
    );
  }

  async findAll(query = {}) {
    let {
      page = 1,
      limit = 10,
      search,
      sortBy = "id",
      sortOrder = "asc",
      ...filters
    } = query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    const values = [];
    const conditions = [];
    let index = 1;

    // SEARCH (opsional, berdasarkan searchableFields)
    if (search && this.searchableFields.length > 0) {
      const searchConditions = this.searchableFields
        .map((field) => `${field} ILIKE $${index}`)
        .join(" OR ");

      conditions.push(`(${searchConditions})`);
      values.push(`%${search}%`);
      index++;
    }

    // FILTER dinamis berdasarkan allowedFields
    Object.keys(filters).forEach((key) => {
      if (this.allowedFields.includes(key)) {
        conditions.push(`${key} = $${index}`);
        values.push(filters[key]);
        index++;
      }
    });

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const allowedSort = ["id", ...this.allowedFields];
    if (!allowedSort.includes(sortBy)) {
      sortBy = "id";
    }

    const order =
      sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const dataQuery = `
      SELECT *
      FROM ${this.table}
      ${whereClause}
      ORDER BY ${sortBy} ${order}
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    values.push(limit);
    values.push(offset);

    const { rows } = await pool.query(dataQuery, values);

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM ${this.table}
      ${whereClause}
    `;

    const { rows: countRows } = await pool.query(
      countQuery,
      values.slice(0, values.length - 2)
    );

    const totalData = countRows[0]?.total || 0;
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: rows,
      meta: {
        page,
        limit,
        totalData,
        totalPage,
        hasNext: page < totalPage,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.table} WHERE email = $1`,
      [email]
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
