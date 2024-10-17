const express = require('express');

const validate = require('@/middlewares/validate.middleware');
const importSlipController = require('@/controllers/importSlip.controller');
const importSlipValidation = require('@/validations/importSlip.validation');
const { auth } = require('@/middlewares/auth.middleware');

const importSlipRouter = express.Router();

importSlipRouter.post('/createImportSlip', auth, validate(importSlipValidation.createdImportSlip), importSlipController.createdImportSlip);
importSlipRouter.get('/:importSlipId', auth, validate(importSlipValidation.getImportSlipById), importSlipController.getImportSlipById);
importSlipRouter.delete('/:importSlipId', auth, validate(importSlipValidation.deletedImportSlip), importSlipController.deletedImportSlip);

module.exports = importSlipRouter;
