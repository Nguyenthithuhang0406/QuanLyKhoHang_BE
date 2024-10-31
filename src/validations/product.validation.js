const joi = require('joi');
const { ObjectId } = require('./custom.validation');

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

const updatedProduct = {
  body: joi.object({
    productName: joi.string()
      .optional()
      .messages({
        'string.base': 'Product name must be a string',
      }),
    productGroup: joi.string()
      .optional()
      .messages({
        'string.base': 'Product group must be a string',
      }),
    productMedia: joi.array()
      .items(joi.string())
      .optional()
      .messages({
        'array.base': 'Product media must be an array',
      }),
    fileUrls: joi.array()
      .items(joi.string())
      .optional()
      .messages({
        'array.base': 'Product media must be an array',
      }),
    productDescription: joi.string()
      .optional()
      .messages({
        'string.base': 'Product description must be a string',
      }),
    productDVT: joi.string()
      .optional()
      .messages({
        'string.base': 'Product DVT must be a string',
      }),
    productPrice: joi.number()
      .optional()
      .messages({
        'number.base': 'Product price must be a number',
      }),
  }),
  params: joi.object({
    productId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'Product id must be a string',
        'string.empty': 'Product id cannot be an empty',
        'any.required': 'Product id is required',
        'any.custom': 'Product id must be a valid id',
      }),
  }),
};

const deleteProduct = {
  params: joi.object({
    productId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'Product id must be a string',
        'string.empty': 'Product id cannot be an empty',
        'any.required': 'Product id is required',
        'any.custom': 'Product id must be a valid id',
      }),
  }),
};

const getProductById = {
  params: joi.object({
    productId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'Product id must be a string',
        'string.empty': 'Product id cannot be an empty',
        'any.required': 'Product id is required',
        'any.custom': 'Product id must be a valid id',
      }),
  }),
};

const getProducts = {
  query: joi.object({
    page: joi.number()
      .min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be greater than or equal to 1',
      }),
    limit: joi.number()
      .min(1)
      .max(100)
      .messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be greater than or equal to 1',
        'number.max': 'Limit must be less than or equal to 100',
      }),
    sortBy: joi.string()
      .messages({
        'string.base': 'Sort by must be a string',
      }),
  }),
};

const searchProduct = {
  query: joi.object({
    page: joi.number()
      .min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be greater than or equal to 1',
      }),
    limit: joi.number()
      .min(1)
      .max(20)
      .messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be greater than or equal to 1',
        'number.max': 'Limit must be less than or equal to 100',
      }),
    sortBy: joi.string()
      .messages({
        'string.base': 'Sort by must be a string',
      }),
    productCode: joi.string()
      .optional()
      .allow('')
      .messages({
        'string.base': 'Product code must be a string',
      }),
    productName: joi.string()
      .optional()
      .allow('')
      .messages({
        'string.base': 'Product name must be a string',
      }),
  }),
};

module.exports = {
  createdProduct,
  updatedProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProduct,
};