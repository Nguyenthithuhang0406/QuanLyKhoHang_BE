const joi = require('joi');

const createdProduct = {
  body: joi.object({
    productCode: joi.string()
      .required()
      .messages({
        'string.base': 'Product code must be a string',
        'string.empty': 'Product code cannot be an empty',
        'any.required': 'Product code is required',
      }),
    productName: joi.string()
      .required()
      .messages({
        'string.base': 'Product name must be a string',
        'string.empty': 'Product name cannot be an empty',
        'any.required': 'Product name is required',
      }),
    productGroup: joi.string()
      .required()
      .messages({
        'string.base': 'Product group must be a string',
        'string.empty': 'Product group cannot be an empty',
        'any.required': 'Product group is required',
      }),
    fileUrls: joi.array()
      .items(joi.string())
      .required()
      .messages({
        'array.base': 'Product media must be an array',
        'array.empty': 'Product media cannot be an empty',
        'any.required': 'Product media is required',
      }),
    productDescription: joi.string()
      .required()
      .messages({
        'string.base': 'Product description must be a string',
        'string.empty': 'Product description cannot be an empty',
        'any.required': 'Product description is required',
      }),
    productDVT: joi.string()
      .required()
      .messages({
        'string.base': 'Product DVT must be a string',
        'string.empty': 'Product DVT cannot be an empty',
        'any.required': 'Product DVT is required',
      }),
    productPrice: joi.number()
      .required()
      .messages({
        'number.base': 'Product price must be a number',
        'number.empty': 'Product price cannot be an empty',
        'any.required': 'Product price is required',
      }),
  }),
};

module.exports = {
  createdProduct,
};