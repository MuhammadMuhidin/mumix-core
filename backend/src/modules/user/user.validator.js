const joi = require("joi");

exports.create = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    password: joi.string().min(6).required()

});

exports.update = joi.object({
  name: joi.string().optional(),
  email: joi.string().email().optional(),
  phone: joi.string().optional(),
  password: joi.string().min(6).optional(),
  is_active: joi.boolean().optional(),
  role: joi.string().valid("admin", "user").optional()
});