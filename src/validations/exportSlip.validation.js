const joi = require("joi");
const { ObjectId } = require("./custom.validation");

const createdExportSlip = {
  body: joi.object({
    exportSlipCode: joi.string()
      .required()
      .messages({
        "string.base": "Export slip code must be a string",
        "string.empty": "Export slip code cannot be an empty",
        "any.required": "Export slip code is required",
      }),
    providerId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "Provider id must be a string",
        "string.empty": "Provider id cannot be an empty",
        "any.required": "Provider id is required",
        "any.custom": "Provider id must be avalid id",
      }),
    userId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "User id must be a string",
        "string.empty": "User id cannot be an empty",
        "any.required": "User id is required",
        "any.custom": "User id must be avalid id",
      }),
    status: joi.string()
      .valid("PENDING", "CONFIRMED", "REJECTED", "DONE")
      .required()
      .messages({
        "string.base": "Status must be a string",
        "string.empty": "Status cannot be an empty",
        "any.required": "Status is required",
        "any.only": "Status must be PENDING, CONFIRMED or REJECTED",
      }),
    exportPrice: joi.string()
      .required()
      .messages({
        "string.base": "Export price must be a string",
        "string.empty": "Export price cannot be an empty",
        "any.required": "Export price is required",
      }),
    products: joi.array()
      .items(joi.object({
        productId: joi.string()
          .required()
          .custom(ObjectId)
          .messages({
            "string.base": "Product id must be a string",
            "string.empty": "Product id cannot be an empty",
            "any.required": "Product id is required",
            "any.custom": "Product id must be avalid id",
          }),
        quantity: joi.number()
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.empty": "Quantity cannot be an empty",
            "any.required": "Quantity is required",
          }),
        discount: joi.number()
          .required()
          .messages({
            "number.base": "Discount must be a number",
            "number.empty": "Discount cannot be an empty",
            "any.required": "Discount is required",
          }),
      }))
      .optional()
      .messages({
        "array.base": "Products must be an array",
        "array.empty": "Products cannot be an empty",
      }),
    newProducts: joi.array()
      .items(joi.object({
        productCode: joi.string()
          .required()
          .messages({
            "string.base": "Product code must be a string",
            "string.empty": "Product code cannot be an empty",
            "any.required": "Product code is required",
          }),
        productName: joi.string()
          .required()
          .messages({
            "string.base": "Product name must be a string",
            "string.empty": "Product name cannot be an empty",
            "any.required": "Product name is required",
          }),
        productGroup: joi.string()
          .required()
          .messages({
            "string.base": "Product group must be a string",
            "string.empty": "Product group cannot be an empty",
            "any.required": "Product group is required",
          }),
        productMedia: joi.array()
          .items(joi.string())
          .optional()
          .messages({
            "array.base": "Product media must be an array",
          }),
        productDescription: joi.string()
          .required()
          .messages({
            "string.base": "Product description must be a string",
            "string.empty": "Product description cannot be an empty",
            "any.required": "Product description is required",
          }),
        productDVT: joi.string()
          .required()
          .messages({
            "string.base": "Product DVT must be a string",
            "string.empty": "Product DVT cannot be an empty",
            "any.required": "Product DVT is required",
          }),
        productPrice: joi.number()
          .required()
          .messages({
            "number.base": "Product price must be a number",
            "number.empty": "Product price cannot be an empty",
            "any.required": "Product price is required",
          }),
        quantity: joi.number()
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.empty": "Quantity cannot be an empty",
            "any.required": "Quantity is required",
          }),
        discount: joi.number()
          .required()
          .messages({
            "number.base": "Discount must be a number",
            "number.empty": "Discount cannot be an empty",
            "any.required": "Discount is required",
          }),
      }))
      .optional()
      .messages({
        "array.base": "New products must be an array",
      }),
    contracts: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "Contract id must be a string",
        "string.empty": "Contract id cannot be an empty",
        "any.required": "Contract id is required",
        "any.custom": "Contract id must be avalid id",
      }),
    type: joi.string()
      .valid("Agency", "Provider", "Customer")
      .required()
      .messages({
        "string.base": "Type must be a string",
        "string.empty": "Type cannot be an empty",
        "any.required": "Type is required",
        "any.only": "Type must be AGENCY, PROVIDER or CUSTOMER",
      }),
    reason: joi.string()
      .optional()
      .messages({
        "string.base": "Reason must be a string",
        "string.empty": "Reason cannot be an empty",
      }),
  })
}

const getExportSlipById = {
  params: joi.object({
    exportSlipId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "Export slip id must be a string",
        "string.empty": "Export slip id cannot be an empty",
        "any.required": "Export slip id is required",
        "any.custom": "Export slip id must be avalid id",
      }),
  }),
}

const deletedExportSlip = {
  params: joi.object({
    exportSlipId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "Export slip id must be a string",
        "string.empty": "Export slip id cannot be an empty",
        "any.required": "Export slip id is required",
        "any.custom": "Export slip id must be avalid id",
      }),
  }),
}

const updatedStatusExportSlip = {
  params: joi.object({
    exportSlipId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "Export slip id must be a string",
        "string.empty": "Export slip id cannot be an empty",
        "any.required": "Export slip id is required",
        "any.custom": "Export slip id must be avalid id",
      }),
  }),
  body: joi.object({
    status: joi.string()
      .valid("PENDING", "CONFIRMED", "REJECTED", "DONE", "RETURNED")
      .required()
      .messages({
        "string.base": "Status must be a string",
        "string.empty": "Status cannot be an empty",
        "any.required": "Status is required",
        "any.only": "Status must be PENDING, CONFIRMED, REJECTED, DONE or RETURNED",
      }),
  }),
};

const getExportSlipByType = {
  query: joi.object({
    type: joi.string()
      .valid("Agency", "Provider", "Customer")
      .required()
      .messages({
        "string.base": "Type must be a string",
        "string.empty": "Type cannot be an empty",
        "any.required": "Type is required",
        "any.only": "Type must be AGENCY, PROVIDER or CUSTOMER",
      }),
    limit: joi.number()
      .optional()
      .messages({
        "number.base": "Limit must be a number",
      }),
    page: joi.number()
      .optional()
      .messages({
        "number.base": "Page must be a number",
      }),
  }),
};

const searchExportSlips = {
  query: joi.object({
    exportSlipCode: joi.string()
      .optional()
      .allow("")
      .messages({
        "string.base": "Export slip code must be a string",
        "string.empty": "Export slip code cannot be an empty",
      }),
    providerId: joi.string()
      .optional()
      .allow("")
      .custom(ObjectId)
      .messages({
        "string.base": "Provider id must be a string",
        "string.empty": "Provider id cannot be an empty",
        "any.custom": "Provider id must be avalid id",
      }),
    agencyId: joi.string()
      .optional()
      .allow("")
      .custom(ObjectId)
      .messages({
        "string.base": "Agency id must be a string",
        "string.empty": "Agency id cannot be an empty",
        "any.custom": "Agency id must be avalid id",
      }),
    customerId: joi.string()
      .optional()
      .allow("")
      .custom(ObjectId)
      .messages({
        "string.base": "Customer id must be a string",
        "string.empty": "Customer id cannot be an empty",
        "any.custom": "Customer id must be avalid id",
      }),
    timeStart: joi.date()
      .optional()
      .allow("")
      .messages({
        "date.base": "Time start must be a date",
      }),
    timeEnd: joi.date()
      .optional()
      .allow("")
      .messages({
        "date.base": "Time end must be a date",
      }),
    status: joi.string()
      .valid("PENDING", "CONFIRMED", "REJECTED", "DONE")
      .optional()
      .allow("")
      .messages({
        "string.base": "Status must be a string",
        "string.empty": "Status cannot be an empty",
        "any.only": "Status must be PENDING, CONFIRMED or REJECTED",
      }),
    limit: joi.number()
      .optional()
      .allow("")
      .messages({
        "number.base": "Limit must be a number",
      }),
    page: joi.number()
      .optional()
      .allow("")
      .messages({
        "number.base": "Page must be a number",
      }),
    type: joi.string()
      .valid("Agency", "Provider", "Customer")
      .required()
      .messages({
        "string.base": "Type must be a string",
        "string.empty": "Type cannot be an empty",
        "any.only": "Type must be AGENCY, PROVIDER or CUSTOMER",
      }),
  }),
}

module.exports = {
  createdExportSlip,
  getExportSlipById,
  deletedExportSlip,
  updatedStatusExportSlip,
  getExportSlipByType,
  searchExportSlips,
}