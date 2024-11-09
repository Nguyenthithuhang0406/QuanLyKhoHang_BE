const express = require("express");
const validate = require("@/middlewares/validate.middleware");
const generalStatisticsValidation = require("@/validations/generalStatistics.validation");
const generalStatisticsController = require("@/controllers/generalStatistics.controller");
const {auth} = require("@/middlewares/auth.middleware");

const generalStatisticsRouter = express.Router();

generalStatisticsRouter.get(
  "/import-export-ratio",
  auth,
  validate(generalStatisticsValidation.importExportRatio),
  generalStatisticsController.importExportRatio
);

generalStatisticsRouter.get(
  "/export-with-source",
  auth,
  validate(generalStatisticsValidation.exportWithSource),
  generalStatisticsController.exportWithSource
);

generalStatisticsRouter.get(
  "/import-with-source",
  auth,
  validate(generalStatisticsValidation.importWithSource),
  generalStatisticsController.importWithSource
);

module.exports = generalStatisticsRouter;
