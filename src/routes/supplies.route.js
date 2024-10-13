const express = require('express');
const validate = require('@/middlewares/validate.middleware');
const suppliesController = require('@/controllers/supplies.controller');
const suppliesValidation = require('@/validations/supplies.validation');
const { auth } = require('@/middlewares/auth.middleware');
const { roleMiddleware } = require('@/middlewares/role.middleware');

const suppliesRouter = express.Router();

suppliesRouter.post('/createSupplies', auth, roleMiddleware, validate(suppliesValidation.createdSupply), suppliesController.createdSupply);

module.exports = suppliesRouter;