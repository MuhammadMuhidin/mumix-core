const service = require("./user.service");
const { success } = require("../../core/app.response");
const AppError = require("../../core/app.error");

exports.findAll = async (req, res, next) => {
  try
  {
    const users = await service.findAll(req.query);
    success(res, users.data, users.meta);
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
    success(res, user);
  }
  catch(err)
  {
    next(err);
  }
};

exports.update = async (req, res, next) => {
try 
  {
    const id = Number(req.params.id);
    const user = await service.update(id, req.body);
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
    const id = Number(req.params.id);
    const user = await service.remove(id);
    success(res, user);
  }
  catch(err)
  {
    next(err);
  }

};
