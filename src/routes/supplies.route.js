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
suppliesRouter.get('/getSupplyById/:type/:supplyId', auth, validate(suppliesValidation.getSupplyById), suppliesController.getSupplyById);
suppliesRouter.get('/getSupplies', auth, validate(suppliesValidation.getSupplies), suppliesController.getSupplies);
suppliesRouter.get('/searchSupply', auth, validate(suppliesValidation.searchSupply), suppliesController.searchSupply);

module.exports = suppliesRouter;