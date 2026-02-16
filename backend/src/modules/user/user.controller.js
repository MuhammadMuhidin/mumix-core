const service = require("./user.service");

exports.findAll = async (req, res, next) => {
  try
  {
    const users = await service.findAll();
    res.status(200).json(users);
  }
  catch(err)
  {
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try
  {
    const user = await service.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
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
    res.status(200).json(user);
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
    res.status(200).json(user);
  }
  catch(err)
  {
    next(err);
  }
};