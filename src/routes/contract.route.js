const express = require('express');

const validate = require('@/middlewares/validate.middleware');
const contractController = require('@/controllers/contract.controller');
const contractValidation = require('@/validations/contract.validation');
const { auth } = require('@/middlewares/auth.middleware');
const upload = require('@/middlewares/upload.middleware');
const uploadFiles = require('@/controllers/upload.controller');

const contractRouter = express.Router();

contractRouter.post('/createdContract', auth, upload.array('contractMedia', 10), uploadFiles, validate(contractValidation.createdContract), contractController.createdContract);

module.exports = contractRouter;