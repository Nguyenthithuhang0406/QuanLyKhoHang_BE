const bcrypt = require("bcrypt");
const httpStatus = require("http-status");

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

module.exports = {
  register,
};