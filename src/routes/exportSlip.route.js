const express = require('express');

const validate = require('@/middlewares/validate.middleware');
const exportSlipController = require('@/controllers/exportSlip.controller');
const exportSlipValidation = require('@/validations/exportSlip.validation');
const { auth } = require('@/middlewares/auth.middleware');

const exportSlipRouter = express.Router();

exportSlipRouter.post('/createExportSlip', auth, validate(exportSlipValidation.createdExportSlip), exportSlipController.createdExportSlip);
// exportSlipRouter.get('/searchImportSlips', auth, validate(importSlipValidation.searchImportSlips), importSlipController.searchImportSlips);
exportSlipRouter.get('/:exportSlipId', auth, validate(exportSlipValidation.getExportSlipById), exportSlipController.getExportSlipById);
exportSlipRouter.delete('/:exportSlipId', auth, validate(exportSlipValidation.deletedExportSlip), exportSlipController.deletedExportSlip);
exportSlipRouter.put('/:exportSlipId', auth, validate(exportSlipValidation.updatedStatusExportSlip), exportSlipController.updatedStatusExportSlip);

module.exports = exportSlipRouter;