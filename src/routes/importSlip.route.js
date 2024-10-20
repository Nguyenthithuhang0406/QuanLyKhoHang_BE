const express = require('express');

const validate = require('@/middlewares/validate.middleware');
const importSlipController = require('@/controllers/importSlip.controller');
const importSlipValidation = require('@/validations/importSlip.validation');
const { auth } = require('@/middlewares/auth.middleware');

const importSlipRouter = express.Router();

importSlipRouter.post('/createImportSlip', auth, validate(importSlipValidation.createdImportSlip), importSlipController.createdImportSlip);
importSlipRouter.get('/searchImportSlips', auth, validate(importSlipValidation.searchImportSlips), importSlipController.searchImportSlips);
importSlipRouter.get('/', auth, validate(importSlipValidation.getImportSlipByType), importSlipController.getImportSlipByType);
importSlipRouter.get('/:importSlipId', auth, validate(importSlipValidation.getImportSlipById), importSlipController.getImportSlipById);
importSlipRouter.delete('/:importSlipId', auth, validate(importSlipValidation.deletedImportSlip), importSlipController.deletedImportSlip);
importSlipRouter.put('/:importSlipId', auth, validate(importSlipValidation.updatedStatusImportSlip), importSlipController.updatedStatusImportSlip);

module.exports = importSlipRouter;
