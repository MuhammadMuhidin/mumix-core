const UserService = require("../services/user.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await UserService.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    console.log("PARAM ID:", req.params.id);
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const data = await UserService.getOne(id);

    if (!data) {
      return res.status(404).json({ message: "Not Found" });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await UserService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await UserService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.patch = async (req, res, next) => {
  try {
    const data = await UserService.patch(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await UserService.remove(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};