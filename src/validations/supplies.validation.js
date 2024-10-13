const Joi = require('joi');
const { ObjectId } = require('./custom.validation');
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

const updatedSupply = {
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
      .optional()
      .messages({
        'string.base': 'Code must be a string',
      }),
    name: Joi.string()
      .optional()
      .messages({
        'string.base': 'Name must be a string',
      }),
    address: Joi.string()
      .optional()
      .messages({
        'string.base': 'Address must be a string',
      }),
    phone: Joi.string()
      .optional()
      .messages({
        'string.base': 'Phone must be a string',
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email',
      }),
    representative: Joi.string()
      .optional()
      .messages({
        'string.base': 'Representative must be a string',
      }),
  }),
  params: Joi.object({
    supplyId: Joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'Supply id must be a string',
        'string.empty': 'Supply id cannot be an empty',
        'any.required': 'Supply id is required',
        'any.custom': 'Supply id must be a valid id',
      }),
  }),
};

const deletedSupply = {
  params: Joi.object({
    supplyId: Joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'Supply id must be a string',
        'string.empty': 'Supply id cannot be an empty',
        'any.required': 'Supply id is required',
        'any.custom': 'Supply id must be a valid id',
      }),
  }),
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
  }),
};

module.exports = {
  createdSupply,
  updatedSupply,
  deletedSupply,
};