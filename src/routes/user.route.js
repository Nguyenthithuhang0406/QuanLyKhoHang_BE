
const express = require('express');

const validate = require('../middlewares/validate.middleware');

const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');

const userRouter = express.Router();

userRouter.post('/register', validate(userValidation.register), userController.register);

module.exports = userRouter;