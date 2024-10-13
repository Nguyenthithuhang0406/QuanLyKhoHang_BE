const Joi = require('joi');
const createdSupply = {
  body: Joi.object({
    type: Joi.string()
      .valid('agency', 'provider')
      .required()
      .messages({
        'string.base': 'Type must be a string',
        'string.empty': 'Type cannot be an empty',
        'any.required': 'Type is required',
        'any.only': 'Type must be agency or provider',
      }),
    code: Joi.string()
      .required()
      .messages({
        'string.base': 'Code must be a string',
        'string.empty': 'Code cannot be an empty',
        'any.required': 'Code is required',
      }),
    name: Joi.string()
      .required()
      .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be an empty',
        'any.required': 'Name is required',
      }),
    address: Joi.string()
      .required()
      .messages({
        'string.base': 'Address must be a string',
        'string.empty': 'Address cannot be an empty',
        'any.required': 'Address is required',
      }),
    phone: Joi.string()
      .required()
      .messages({
        'string.base': 'Phone must be a string',
        'string.empty': 'Phone cannot be an empty',
        'any.required': 'Phone is required',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be an empty',
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email',
      }),
    representative: Joi.string()
      .required()
      .messages({
        'string.base': 'Representative must be a string',
        'string.empty': 'Representative cannot be an empty',
        'any.required': 'Representative is required',
      }),
  }),
};

module.exports = {
  createdSupply,
};