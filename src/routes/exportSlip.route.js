const express = require('express');

const validate = require('@/middlewares/validate.middleware');
const exportSlipController = require('@/controllers/exportSlip.controller');
const exportSlipValidation = require('@/validations/exportSlip.validation');
const { auth } = require('@/middlewares/auth.middleware');

const exportSlipRouter = express.Router();

exportSlipRouter.post('/createExportSlip', auth, validate(exportSlipValidation.createdExportSlip), exportSlipController.createdExportSlip);

module.exports = exportSlipRouter;