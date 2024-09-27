const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const catchAsync = require("@/utils/catchAsync");
const ApiError = require("@/utils/apiError");
const User = require("../models/user.model");

const auth = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  };

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Access denied. No token provided");
  };

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || user.isActive === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Access denied. User not found");
    };

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
});

module.exports = {auth};