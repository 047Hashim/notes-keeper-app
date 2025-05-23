const Joi = require("joi");
module.exports.schema = Joi.object({
  note: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }).required(),
});
