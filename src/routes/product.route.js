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
// productRouter.put('/updatedProduct/:productId', auth, roleMiddleware, upload.array('productMedia', 10), uploadFiles, validate(productValidation.updatedProduct), productController.updatedProduct);
productRouter.put('/updatedProduct/:productId', auth, roleMiddleware, validate(productValidation.updatedProduct), productController.updatedProduct);
productRouter.delete('/deleteProduct/:productId', auth, roleMiddleware, validate(productValidation.deleteProduct), productController.deleteProduct);
productRouter.get('/getProductById/:productId', auth, validate(productValidation.getProductById), productController.getProductById);
productRouter.get('/getProducts', auth, validate(productValidation.getProducts), productController.getProducts);
productRouter.get('/searchProduct', auth, validate(productValidation.searchProduct), productController.searchProduct);

module.exports = productRouter;