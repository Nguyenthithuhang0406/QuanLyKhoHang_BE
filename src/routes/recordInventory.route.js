const express = require("express");

const validate = require("../middlewares/validate.middleware");
const recordInventoryController = require("../controllers/recordInventory.controller");
const recordInventoryValidation = require("../validations/recordInventory.validation");
const { auth } = require("../middlewares/auth.middleware");

const recordInventoryRouter = express.Router();

recordInventoryRouter.post(
  "/createdInventory",
  auth,
  validate(recordInventoryValidation.createdRecordInventory),
  recordInventoryController.createdRecordInventory
);

recordInventoryRouter.put(
  "/updatedStatusRecordInventory/:recordInventoryId",
  auth,
  validate(recordInventoryValidation.updatedStatusRecordInventoryy),
  recordInventoryController.updatedStatusRecordInventory
);

recordInventoryRouter.delete(
  "/deleteRecordInventory/:recordInventoryId",
  auth,
  validate(recordInventoryValidation.deletedRecordInventory),
  recordInventoryController.deletedRecordInventory
);

recordInventoryRouter.get(
  "/getRecordInventoryById/:recordInventoryId",
  auth,
  validate(recordInventoryValidation.getRecordInventoryById),
  recordInventoryController.getRecordInventoryById
);

recordInventoryRouter.get(
  "/getRecordInventories",
  auth,
  validate(recordInventoryValidation.getRecordInventories),
  recordInventoryController.getRecordInventories
);

recordInventoryRouter.get(
  "/searchRecordInventory",
  auth,
  validate(recordInventoryValidation.searchRecordInventory),
  recordInventoryController.searchRecordInventory
);

module.exports = recordInventoryRouter;
