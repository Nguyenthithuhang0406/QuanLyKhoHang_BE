const httpStatus = require("http-status");
const Contract = require("../models/contract.model");
const catchAsync = require("../utils/catchAsync");

const createdContract = catchAsync(async (req, res) => {
  const { contractContent, fileUrls } = req.body;

  const newContract = new Contract({
    contractContent,
    contractMedia: fileUrls,
  });

  await newContract.save();

  return res.status(httpStatus.CREATED).json({
    message: "Contract created successfully",
    code: httpStatus.CREATED,
    data: {
      newContract,
    },
  });
});

module.exports = {
  createdContract,
};