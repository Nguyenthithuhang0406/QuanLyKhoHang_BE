const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const User = require("@/models/user.model");
const OTP = require("../models/otp.model");
const ApiError = require("@/utils/apiError");
const catchAsync = require("@/utils/catchAsync");
const { sendEmail } = require("../utils/nodemailer");

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

module.exports = {
  register,
  verifyOTP,
  login,
};
