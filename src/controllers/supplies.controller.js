const httpStatus = require("http-status");
const catchAsync = require("@/utils/catchAsync");
const ApiError = require("@/utils/apiError");
const Agency = require("../models/agency.model");
const Provider = require("../models/provider.model");

const createdSupply = catchAsync(async (req, res) => {
  const { code, name, address, phone, email, representative, type } = req.body;

  if (type === 'agency') {
    const existingAgency = await Agency.findOne({ agencyCode: code });
    if (existingAgency) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Agency already exists");
    }

    const agency = new Agency({
      agencyCode: code,
      agencyName: name,
      agencyAddress: address,
      agencyPhone: phone,
      agencyEmail: email,
      representative,
    });

    await agency.save();

    return res.status(httpStatus.CREATED).json({
      message: "Agency created successfully",
      code: httpStatus.CREATED,
      data: {
        agency,
      },
    });
  } else {
    const existingProvider = await Provider.findOne({ providerCode: code });
    if (existingProvider) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Provider already exists");
    }

    const provider = new Provider({
      providerCode: code,
      providerName: name,
      providerAddress: address,
      providerPhone: phone,
      providerEmail: email,
      representative,
    });

    await provider.save();

    return res.status(httpStatus.CREATED).json({
      message: "Provider created successfully",
      code: httpStatus.CREATED,
      data: {
        provider,
      },
    });
  }
});

module.exports = {
  createdSupply,
};