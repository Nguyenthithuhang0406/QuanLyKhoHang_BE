
const express = require('express');

const validate = require('../middlewares/validate.middleware');

const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');

const userRouter = express.Router();

userRouter.post('/register', validate(userValidation.register), userController.register);
userRouter.post('/verify-otp', validate(userValidation.verifyOTP), userController.verifyOTP);
userRouter.post('/login', validate(userValidation.login), userController.login);
userRouter.post('/refresh-token', validate(userValidation.getRefreshToken), userController.getRefreshToken);

module.exports = userRouter;