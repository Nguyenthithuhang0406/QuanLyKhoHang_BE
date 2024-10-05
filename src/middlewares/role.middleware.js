
const catchAsync = require("../utils/catchAsync");

const roleMiddleware = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (user.role !== "manager") {
    return res.status(403).json({
      message: "Access denied. You are not an manager",
      code: 403,
    });
  }

  next();
});

module.exports = {roleMiddleware};