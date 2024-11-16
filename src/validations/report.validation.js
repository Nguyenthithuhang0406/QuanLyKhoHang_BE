const joi = require("joi");
const reportExportImportInventory = {
  query: joi.object({
    timeStart: joi.date().optional(),
    timeEnd: joi.date().optional(),
  }),
};

module.exports = {
  reportExportImportInventory,
};