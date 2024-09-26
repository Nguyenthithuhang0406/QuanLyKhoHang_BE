const joi = require('joi');
const { validateEmail } = require('./utils.validation');

const register = {
  body: joi.object({
    staffCode: joi.string()
      .required()
      .messages({
        'string.base': 'Staff code must be a string',
        'string.empty': 'Staff code cannot be an empty',
        'any.required': 'Staff code is required',
      }),
    fullName: joi.string()
      .required()
      .min(5)
      .max(30)
      .messages({
        'string.base': 'Full name must be a string',
        'string.empty': 'Full name cannot be an empty',
        'string.min': 'Full name must be at least 5 characters long',
        'string.max': 'Full name must be at most 30 characters long',
        'any.required': 'Full name is required',
      }),
    email: joi.string()
      .custom((value, helpers) => {
        if (!validateEmail(value)) {
          return helpers.error('any.invalid', { message: 'Email is invalid' });
        }
        return value;
      })
      .required()
      .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be an empty',
        'any.required': 'Email is required',
      }),
    userName: joi.string()
      .required()
      .min(5)
      .max(30)
      .messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be an empty',
        'string.min': 'Username must be at least 5 characters long',
        'string.max': 'Username must be at most 30 characters long',
        'any.required': 'Username is required',
      }),
    password: joi.string()
      .required()
      .min(8)
      .max(16)
      .pattern(/[!@#$%^&*(),.?":{}|<>]/)
      .pattern(/\d/)
      .pattern(/[A-Za-z].*[A-Za-z]/)
      .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be an empty',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be at most 16 characters long',
        'string.pattern.base': 'Password must contain at least 1 numeric character, 1 special character and 2 alphabetic characters',
        'any.required': 'Password is required',
      }),
    role: joi.string().required(),
  }),
};

module.exports = {
  register,
};