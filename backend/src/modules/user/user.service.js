const repo = require("./user.repository");
const AppError = require("../../core/app.error");
const bcrypt = require("bcrypt");

exports.findAll = async (query) => repo.findAll(query);
exports.findById = async (id) => repo.findById(id);

exports.create = async (data) => {
    if (await repo.findByEmail(data.email)) {
        throw new AppError("Email already exists", 400);
    }
    data.password = await bcrypt.hash(data.password, 10);
    return repo.create(data);
}

exports.update = async (id, data) => {
  const existingUser = await repo.findById(id);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  const updateData = { ...data };

  // 🔐 Jika password diisi dan tidak kosong → hash + invalidate session
  if (data.password && data.password.trim() !== "") {
    updateData.password = await bcrypt.hash(data.password, 10);
    updateData.token_version = Number(existingUser.token_version) + 1;
  } else {
    delete updateData.password; // jangan overwrite password lama
  }

  // 🚫 Jika status berubah → invalidate session
  if (
    typeof data.is_active !== "undefined" &&
    data.is_active !== existingUser.is_active
  ) {
    updateData.token_version = Number(existingUser.token_version) + 1;
  }

  return repo.update(id, updateData);
};

exports.remove = async (id) => repo.remove(id);