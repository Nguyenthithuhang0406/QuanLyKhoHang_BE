const express = require("express");

const validate = require("../middlewares/validate.middleware");
const reportController = require("../controllers/report.controller");
const reportValidation = require("../validations/report.validation");
const { auth } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");

const reportRouter = express.Router();

reportRouter.get(
  "/import-export-inventory",
  auth,
  roleMiddleware,
  validate(reportValidation.reportExportImportInventory),
  reportController.reportExportImportInventory
);

module.exports = reportRouter;
