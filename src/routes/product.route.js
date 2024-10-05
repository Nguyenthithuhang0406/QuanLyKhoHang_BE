const express = require('express');

const validate = require('@/middlewares/validate.middleware');
const productController = require('@/controllers/product.controller');
const productValidation = require('@/validations/product.validation');
const { auth } = require('@/middlewares/auth.middleware');
const upload = require('@/middlewares/upload.middleware');
const { roleMiddleware } = require('@/middlewares/role.middleware');
const uploadFiles = require('@/controllers/upload.controller');

const productRouter = express.Router();

productRouter.post('/createdProduct', auth, roleMiddleware, upload.array('productMedia', 10), uploadFiles, validate(productValidation.createdProduct), productController.createdProduct);

module.exports = productRouter;