const joi = require("joi");
const reportExportImportInventory = {
  query: joi.object({
    timeStart: joi.date().optional().allow(""),
    timeEnd: joi.date().optional().allow(""),
  }),
};

module.exports = {
  reportExportImportInventory,
};