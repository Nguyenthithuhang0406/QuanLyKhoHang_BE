
const express = require('express');

const validate = require('../middlewares/validate.middleware');

const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
// const uploadFiles = require('../controllers/upload.controller');
const userRouter = express.Router();

userRouter.post('/register', validate(userValidation.register), userController.register);
userRouter.post('/verify-otp', validate(userValidation.verifyOTP), userController.verifyOTP);
userRouter.post('/resend-otp', validate(userValidation.resendOTP), userController.resendOTP);
userRouter.post('/login', validate(userValidation.login), userController.login);
userRouter.post('/refresh-token', validate(userValidation.getRefreshToken), userController.getRefreshToken);
userRouter.get('/:userId', auth,  validate(userValidation.getUserById), userController.getUserById);
userRouter.put('/update-password', validate(userValidation.updatePassword), userController.updatePassword);
userRouter.post('/forgot-password', validate(userValidation.forgotPassword), userController.forgotPassword);
userRouter.put('/edit-profile/:userId', auth, validate(userValidation.editProfile), userController.editProfile);
// userRouter.post('/upload', auth, upload.array('files', 10), uploadFiles);
userRouter.post('/upload-avatar/:userId', auth, upload.single('avatar'), validate(userValidation.uploadAvatar), userController.uploadAvatar);

module.exports = userRouter;