const joi = require("joi");
const { ObjectId } = require("./custom.validation");

const createdImportSlip = {
  body: joi.object({
    importSlipCode: joi.string()
      .required()
      .messages({
        "string.base": "Import slip code must be a string",
        "string.empty": "Import slip code cannot be an empty",
        "any.required": "Import slip code is required",
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
      .valid("PENDING", "CONFIRMED", "REJECTED")
      .required()
      .messages({
        "string.base": "Status must be a string",
        "string.empty": "Status cannot be an empty",
        "any.required": "Status is required",
        "any.only": "Status must be PENDING, CONFIRMED or REJECTED",
      }),
    products: joi.array()
      .items(joi.object({
        _id: joi.string()
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

const getImportSlipById = {
  params: joi.object({
    importSlipId: joi.string()
      .required()
      .custom(ObjectId)
      .messages({
        "string.base": "Import slip id must be a string",
        "string.empty": "Import slip id cannot be an empty",
        "any.required": "Import slip id is required",
        "any.custom": "Import slip id must be avalid id",
      }),
  }),
}

module.exports = {
  createdImportSlip,
  getImportSlipById,
};