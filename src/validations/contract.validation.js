const joi = require("joi");

const createdContract = {
  body: joi.object({
    contractContent: joi.string()
      .required()
      .messages({
        "string.base": "Contract content must be a string",
        "string.empty": "Contract content cannot be an empty",
        "any.required": "Contract content is required",
      }),
    fileUrls: joi.array()
      .items(joi.string())
      .required()
      .messages({
        "array.base": "Contract media must be an array",
        "array.empty": "Contract media cannot be an empty",
        "any.required": "Contract media is required",
      }),
  }),
}

module.exports = {
  createdContract,
};