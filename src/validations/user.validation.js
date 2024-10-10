const joi = require('joi');
const { validateEmail } = require('./utils.validation');
const { ObjectId } = require('./custom.validation');

const register = {
  body: joi.object({
    staffCode: joi.string()
      .required()
      .messages({
        'string.base': 'staffCode must be a string',
        'string.empty': 'staffCode cannot be an empty',
        'any.required': 'staffCode is required',
      }),
    fullName: joi.string()
      .required()
      .min(5)
      .max(30)
      .messages({
        'string.base': 'fullName must be a string',
        'string.empty': 'fullName cannot be an empty',
        'string.min': 'fullName must be at least 5 characters long',
        'string.max': 'fullName must be at most 30 characters long',
        'any.required': 'fullName is required',
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

const verifyOTP = {
  body: joi.object({
    otp: joi.number()
      .required()
      .messages({
        'number.base': 'OTP must be a number',
        'number.empty': 'OTP cannot be an empty',
        'any.required': 'OTP is required',
      }),
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'userId must be a string',
        'string.empty': 'userId cannot be an empty',
        'any.required': 'userId is required',
      }),
  }),
};

const resendOTP = {
  body: joi.object({
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
    fullName: joi.string()
      .required()
      .messages({
        'string.base': 'fullName must be a string',
        'string.empty': 'fullName cannot be an empty',
        'any.required': 'fullName is required',
      }),
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'userId must be a string',
        'string.empty': 'userId cannot be an empty',
        'any.required': 'userId is required',
      }),
  }),
};

const login = {
  body: joi.object({
    userName: joi.string()
      .required()
      .messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be an empty',
        'any.required': 'Username is required',
      }),
    password: joi.string()
      .required()
      .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be an empty',
        'any.required': 'Password is required',
      }),
  }),
};

const getRefreshToken = {
  body: joi.object({
    refreshToken: joi.string()
      .required()
      .messages({
        'string.base': 'Refresh token must be a string',
        'string.empty': 'Refresh token cannot be an empty',
        'any.required': 'Refresh token is required',
      }),
  }),
};

const getUserById = {
  params: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'userId must be a string',
        'string.empty': 'userId cannot be an empty',
        'any.required': 'userId is required',
      }),
  }),
};

const updatePassword = {
  body: joi.object({
    newPassword: joi.string()
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
    email: joi.string()
      .custom((value, helpers) => {
        if (!validateEmail(value)) {
          return helpers.error('any.invalid', { message: 'Email is invalid' });
        }
        return value;
      }),
    userName: joi.string()
      .required()
      .messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be an empty',
        'any.required': 'Username is required',
      })
  }),
};

const forgotPassword = {
  body: joi.object({
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
      .messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be an empty',
        'any.required': 'Username is required',
      }),
  }),
};

const editProfile = {
  params: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'userId must be a string',
        'string.empty': 'userId cannot be an empty',
        'any.required': 'userId is required',
      }),
  }),
  body: joi.object({
    fullName: joi.string()
      .min(5)
      .max(30)
      .optional()
      .messages({
        'string.base': 'fullName must be a string',
        'string.empty': 'fullName cannot be an empty',
        'string.min': 'fullName must be at least 5 characters long',
        'string.max': 'fullName must be at most 30 characters long',
      }),
    email: joi.string()
      .custom((value, helpers) => {
        if (!validateEmail(value)) {
          return helpers.error('any.invalid', { message: 'Email is invalid' });
        }
        return value;
      })
      .optional()
      .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be an empty',
      }),
    phoneNumber: joi.string()
      .optional()
      .messages({
        'string.base': 'phoneNumber must be a string',
        'string.empty': 'phoneNumber cannot be an empty',
      }),
    address: joi.string()
      .optional()
      .messages({
        'string.base': 'address must be a string',
        'string.empty': 'address cannot be an empty',
      }),
    gender: joi.string()
      .optional()
      .messages({
        'string.base': "gender must be a string",
        'string.empty': "gender cannot be an empty",
      })
  }),
};

const uploadAvatar = {
  params: joi.object({
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        'string.base': 'userId must be a string',
        'string.empty': 'userId cannot be an empty',
        'any.required': 'userId is required',
      }),
  }),
};

module.exports = {
  register,
  verifyOTP,
  login,
  getRefreshToken,
  getUserById,
  updatePassword,
  forgotPassword,
  editProfile,
  uploadAvatar,
  resendOTP,
};