const express = require('express');
const validate = require('@/middlewares/validate.middleware');
const suppliesController = require('@/controllers/supplies.controller');
const suppliesValidation = require('@/validations/supplies.validation');
const { auth } = require('@/middlewares/auth.middleware');
const { roleMiddleware } = require('@/middlewares/role.middleware');

const suppliesRouter = express.Router();

suppliesRouter.post('/createSupplies', auth, roleMiddleware, validate(suppliesValidation.createdSupply), suppliesController.createdSupply);
suppliesRouter.put('/updateSupplies/:supplyId', auth, roleMiddleware, validate(suppliesValidation.updatedSupply), suppliesController.updatedSupply);
suppliesRouter.delete('/deleteSupplies/:supplyId', auth, roleMiddleware, validate(suppliesValidation.deletedSupply), suppliesController.deletedSupply);

module.exports = suppliesRouter;