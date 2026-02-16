const service = require("./user.service");
const { success, error } = require("../../core/app.response");
const AppError = require("../../core/app.error");
const { getPagination } = require("../../core/app.pagination");

exports.findAll = async (req, res, next) => {
  try
  {
    const { page, limit, offset } = getPagination(req);
    const users = await service.findAll(page, limit, offset);
    success(res, users);
  }
  catch(err)
  {
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try
  {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("Invalid ID", 400);

    const user = await service.findById(id);
    if (!user) throw new AppError("ID not found", 404);

    success(res, user);
  }
  catch(err)
  {
    next(err);
  }
};

exports.create = async (req, res, next) => {
 try
  {
    const user = await service.create(req.body);
    res.status(201).json(user);
  }
  catch(err)
  {
    next(err);
  }
};

exports.update = async (req, res, next) => {
try 
  {
    const user = await service.update(req.params.id, req.body);
    success(res, user);
  }
  catch(err)
  {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
try 
  {
    const user = await service.remove(req.params.id);
    success(res, user);
  }
  catch(err)
  {
    next(err);
  }
};