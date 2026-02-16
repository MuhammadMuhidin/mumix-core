const repo = require("./user.repository");

exports.findAll = async () => repo.findAll();
exports.findById = async (id) => repo.findById(id);
exports.create = async (data) => repo.create(data);
exports.update = async (id, data) => repo.update(id, data);
exports.remove = async (id) => repo.remove(id);