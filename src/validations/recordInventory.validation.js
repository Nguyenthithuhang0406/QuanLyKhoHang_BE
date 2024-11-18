const joi = require("joi");
const { ObjectId } = require("./custom.validation");

const createdRecordInventory = {
  body: joi.object({
    recordInventoryCode: joi.string().required().messages({
      "string.base": "Inventory id must be a string",
      "string.empty": "Inventory id cannot be an empty",
      "any.required": "Inventory id is required",
    }),
    recordInventoryDate: joi.date().optional().allow("").messages({
      "date.base": "Date must be a date",
      "date.empty": "Date cannot be an empty",
      "any.required": "Date is required",
    }),
    agencyId: joi.string().custom(ObjectId).required().messages({
      "any.required": "Agency id is required",
    }),
    purpose: joi.string().required().messages({
      "string.base": "Purpose must be a string",
      "string.empty": "Purpose cannot be an empty",
      "any.required": "Purpose is required",
    }),
    userId: joi.string().custom(ObjectId).required().messages({
      "any.required": "User id is required",
    }),
    products: joi.array().items(
      joi
        .object({
          productId: joi.string().custom(ObjectId).required().messages({
            "any.required": "Product id is required",
          }),
          numberOfSystem: joi.number().required().messages({
            "number.base": "Number of system must be a number",
            "number.empty": "Number of system cannot be an empty",
            "any.required": "Number of system is required",
          }),
          numberOfReality: joi.number().required().messages({
            "number.base": "Number of reality must be a number",
            "number.empty": "Number of reality cannot be an empty",
            "any.required": "Number of reality is required",
          }),
          difference: joi.number().required().messages({
            "number.base": "Difference must be a number",
            "number.empty": "Difference cannot be an empty",
            "any.required": "Difference is required",
          }),
          solution: joi.string().optional().allow("").messages({
            "string.base": "Handle must be a string",
            "string.empty": "Handle cannot be an empty",
            "any.required": "Handle is required",
          }),
        })
        .required()
        .messages({
          "object.base": "Record Inventory must be an object",
          "object.empty": "Record Inventory cannot be an empty",
          "any.required": "Record Inventory is required",
        })
    ),
  }),
};

const updatedStatusRecordInventory = {
  params: joi.object({
    recordInventoryId: joi.string().custom(ObjectId).required().messages({
      "any.required": "Record Inventory id is required",
    }),
  }),
  body: joi.object({
    status: joi.string().required().messages({
      "string.base": "Status must be a string",
      "string.empty": "Status cannot be an empty",
      "any.required": "Status is required",
    }),
    userId: joi.string().custom(ObjectId).required().messages({
      "any.required": "User id is required",
    }),
  }),
};

const deletedRecordInventory = {
  params: joi.object({
    recordInventoryId: joi.string().custom(ObjectId).required().messages({
      "any.required": "Record Inventory id is required",
    }),
  }),
};

const getRecordInventoryById = {
  params: joi.object({
    recordInventoryId: joi.string().custom(ObjectId).required().messages({
      "any.required": "Record Inventory id is required",
    }),
  }),
};

const getRecordInventories = {
  query: joi.object({
    page: joi.number().optional().allow("").messages({
      "number.base": "Page must be a number",
    }),
    limit: joi.number().optional().allow("").messages({
      "number.base": "Limit must be a number",
    }),
  })
};

const searchRecordInventory = {
  query: joi.object({
    page: joi.number().optional().allow("").messages({
      "number.base": "Page must be a number",
    }),
    limit: joi.number().optional().allow("").messages({
      "number.base": "Limit must be a number",
    }),
    recordInventoryCode: joi.string().optional().allow("").messages({
      "string.base": "Record Inventory Code must be a string",
    }),
    status: joi.string().optional().allow("").messages({
      "string.base": "Status must be a string",
    }),
    timeStart: joi.date().optional().allow("").messages({
      "date.base": "Time start must be a date",
    }),
    timeEnd: joi.date().optional().allow("").messages({
      "date.base": "Time end must be a date",
    }),
  }),
};

module.exports = {
  createdRecordInventory,
  updatedStatusRecordInventory,
  deletedRecordInventory,
  getRecordInventoryById,
  getRecordInventories,
  searchRecordInventory,
};
