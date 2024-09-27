const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const User = require("@/models/user.model");
const OTP = require("../models/otp.model");
const ApiError = require("@/utils/apiError");
const catchAsync = require("@/utils/catchAsync");
const { sendEmail, sendEmailWhenForgetPassword } = require("../utils/nodemailer");

const register = catchAsync(async (req, res) => {
  const { staffCode, fullName, email, userName, password, role } = req.body;
  const existingUser = await User.findOne({ userName: userName });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    staffCode: staffCode,
    fullName: fullName,
    email: email,
    userName: userName,
    password: hashedPassword,
    role: role
  });

  await user.save();

  const otp = generateOTP();

  await sendEmail(user.email, user.fullName, otp);

  await OTP.create({ otp, userId: user._id });

  return res.status(httpStatus.CREATED).json({
    message: "User created successfully. OTP sent!",
    code: httpStatus.CREATED,
    data: {
      user,
    },
  });
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

const verifyOTP = catchAsync(async (req, res) => {
  const { otp, userId } = req.body;

  const otpData = await OTP.findOne({ userId });

  if (!otpData) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "OTP invalid",
      code: httpStatus.BAD_REQUEST,
    });
  }

  if (otpData.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  await User.findByIdAndUpdate(userId, { isActive: true });

  return res.status(httpStatus.OK).json({
    message: "OTP verified successfully",
    code: httpStatus.OK,
  });
});

const login = catchAsync(async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName });

  if (!user || !user.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username or password is incorrect");
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username or password is incorrect");
  }

  const payload = { userName: user.userName, userId: user._id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return res.status(httpStatus.OK).json({
    message: "Login successful",
    code: httpStatus.OK,
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

const getRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }

    const newAccessToken = jwt.sign({ userName: user.userName, userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const newRefreshToken = jwt.sign({ userName: user.userName, userId: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return res.status(httpStatus.OK).json({
      message: "Token refreshed successfully",
      code: httpStatus.OK,
      data: {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
});

const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return res.status(httpStatus.OK).json({
    message: "User found",
    code: httpStatus.OK,
    data: {
      user,
    },
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const {userName, email, newPassword } = req.body;

  const user = await User.findOne({ userName });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if(user.email !== email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is incorrect");
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  return res.status(httpStatus.OK).json({
    message: "Password updated successfully",
    code: httpStatus.OK,
    data: {
      user,
    },
  });

});

const forgotPassword = catchAsync(async (req, res) => {
  const { email, userName } = req.body;

  const user = await User.findOne({ userName });
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.email !== email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is incorrect");
  }

  await sendEmailWhenForgetPassword(user.email, user.fullName);

  return res.status(httpStatus.OK).json({
    message: "Email sent successfully",
    code: httpStatus.OK,
    data: {
      user,
    },
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  getRefreshToken,
  getUserById,
  updatePassword,
  forgotPassword,
};
