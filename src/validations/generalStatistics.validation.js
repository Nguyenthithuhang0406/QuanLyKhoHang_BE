const joi = require("joi");

const importExportRatio = {
  query: joi.object({
    timeStart: joi.date().optional().allow("").messages({
      "date.base": "Time start must be a date",
    }),
    timeEnd: joi.date().optional().allow("").messages({
      "date.base": "Time end must be a date",
    }),
  }),
};

const exportWithSource = {
  query: joi.object({
    timeStart: joi.date().optional().allow("").messages({
      "date.base": "Time start must be a date",
    }),
    timeEnd: joi.date().optional().allow("").messages({
      "date.base": "Time end must be a date",
    }),
  }),
};

const importWithSource = {
  query: joi.object({
    timeStart: joi.date().optional().allow("").messages({
      "date.base": "Time start must be a date",
    }),
    timeEnd: joi.date().optional().allow("").messages({
      "date.base": "Time end must be a date",
    }),
  }),
};

module.exports = {
  importExportRatio,
  exportWithSource,
  importWithSource,
};
