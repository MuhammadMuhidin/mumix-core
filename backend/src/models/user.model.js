const pool = require("../config/db");

exports.findAll = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM users ORDER BY id DESC"
  );
  return rows;
};

exports.findById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id=$1",
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const { name, email, phone, is_active } = data;

  const { rows } = await pool.query(
    `INSERT INTO users (name,email,phone,is_active)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [name, email, phone, is_active]
  );

  return rows[0];
};

exports.update = async (id, data) => {
  const { name, email, phone, is_active } = data;

  const { rows } = await pool.query(
    `UPDATE users
     SET name=$1, email=$2, phone=$3, is_active=$4
     WHERE id=$5
     RETURNING *`,
    [name, email, phone, is_active, id]
  );

  return rows[0];
};

exports.patch = async (id, data) => {
  const allowed = ["name", "email", "phone", "is_active"];

  const fields = [];
  const values = [];
  let index = 1;

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key}=$${index}`);
      values.push(data[key]);
      index++;
    }
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id=$${index}
    RETURNING *
  `;

  values.push(id);

  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.remove = async (id) => {
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
};