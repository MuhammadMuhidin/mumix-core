const User = require("../models/user.model");

exports.getAll = async () => {
  return await User.findAll();
};

exports.getOne = async (id) => {
  return await User.findById(id);
};

exports.create = async (payload) => {
  return await User.create(payload);
};

exports.update = async (id, payload) => {
  return await User.update(id, payload);
};

exports.patch = async (id, payload) => {
  return await User.patch(id, payload);
};

exports.remove = async (id) => {
  await User.remove(id);
};