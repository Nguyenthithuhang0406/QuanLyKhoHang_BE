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

const updatedSupply = catchAsync(async (req, res) => {
  const { code, name, address, phone, email, representative, type } = req.body;
  const { supplyId } = req.params;

  if (type === 'agency') {
    const existingAgency = await Agency.findById({ _id: supplyId });
    if (!existingAgency) {
      throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
    }

    const updateAgency = {
      agencyCode: code ? code : existingAgency.agencyCode,
      agencyName: name ? name : existingAgency.agencyName,
      agencyAddress: address ? address : existingAgency.agencyAddress,
      agencyPhone: phone ? phone : existingAgency.agencyPhone,
      agencyEmail: email ? email : existingAgency.agencyEmail,
      representative: representative ? representative : existingAgency.representative,
    }

    Object.assign(existingAgency, updateAgency);

    await existingAgency.save();

    return res.status(httpStatus.OK).json({
      message: "Agency updated successfully",
      code: httpStatus.OK,
      data: {
        updateAgency,
      },
    });

  }
  else {
    const existingProvider = await Provider.findById({ _id: supplyId });
    if (!existingProvider) {
      throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
    }

    const updateProvider = {
      providerCode: code ? code : existingProvider.providerCode,
      providerName: name ? name : existingProvider.providerName,
      providerAddress: address ? address : existingProvider.providerAddress,
      providerPhone: phone ? phone : existingProvider.providerPhone,
      providerEmail: email ? email : existingProvider.providerEmail,
      representative: representative ? representative : existingProvider.representative,
    }

    Object.assign(existingProvider, updateProvider);

    await existingProvider.save();

    return res.status(httpStatus.OK).json({
      message: "Provider updated successfully",
      code: httpStatus.OK,
      data: {
        updateProvider,
      },
    });
  }
});

const deletedSupply = catchAsync(async (req, res) => {
  const { supplyId } = req.params;
  const { type } = req.body;

  if (type === 'agency') {
    const existingAgency = await Agency.findById({ _id: supplyId });
    if (!existingAgency) {
      throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
    }

    await existingAgency.deleteOne();

    return res.status(httpStatus.OK).json({
      message: "Agency deleted successfully",
      code: httpStatus.OK,
    });
  }
  else {
    const existingProvider = await Provider.findById({ _id: supplyId });
    if (!existingProvider) {
      throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
    }

    await existingProvider.deleteOne();

    return res.status(httpStatus.OK).json({
      message: "Provider deleted successfully",
      code: httpStatus.OK,
    });
  }
});

const getSupplyById = catchAsync(async (req, res) => {
  const { supplyId, type } = req.params;
  
  if (type === 'agency') {
    const agency = await Agency.findById({ _id: supplyId });

    if (!agency) {
      throw new ApiError(httpStatus.NOT_FOUND, "Agency not found");
    }

    return res.status(httpStatus.OK).json({
      message: "Agency found",
      code: httpStatus.OK,
      data: {
        agency,
      },
    });
  }
  else {
    const provider = await Provider.findById({ _id: supplyId });

    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
    }

    return res.status(httpStatus.OK).json({
      message: "Provider found",
      code: httpStatus.OK,
      data: {
        provider,
      },
    });
  }
});

const getSupplies = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'name:asc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sortOrder = value === 'desc' ? -1 : 1;

  let agencies = await Agency.find();
  let providers = await Provider.find();

  agencies = agencies.map((agency) => ({
    ...agency.toObject(),
    name: agency.agencyName,
  }));

  providers = providers.map((provider) => ({
    ...provider.toObject(),
    name: provider.providerName,
  }));

  let supplies = [...agencies, ...providers];

  supplies = supplies.sort((a, b) => {
    if (a[field] < b[field]) {
      return -sortOrder;
    }
    if (a[field] > b[field]) {
      return sortOrder;
    }
    return 0;
  });

  supplies = supplies.slice(skip, skip + +limit);
  agencies = await Agency.find().limit(+limit).skip(skip).sort({ agencyName: 1 });
  providers = await Provider.find().limit(+limit).skip(skip).sort({ providerName: 1 });

  const totalAgency = await Agency.countDocuments();
  const totalProvider = await Provider.countDocuments();
  const totalResult = totalAgency + totalProvider;

  return res.status(httpStatus.OK).json({
    message: "Supplies found",
    code: httpStatus.OK,
    data: {
      supplies,
      agencies,
      providers,
      limit: +limit,
      page: +page,
      totalResult,
      totalPage: Math.ceil(totalResult / limit),
    },
  });
});

const searchSupply = catchAsync(async (req, res) => {
  const { code, name, phone, type, limit = 10, page = 1 } = req.query;

  const skip = (+page - 1) * +limit;

  const query = {};
  const orConditions = [];
  
  if (type === 'agency' || !type) {
    if (code) {
      orConditions.push({ agencyCode: { $regex: code, $options: 'i' } });
    }
    if (name) {
      orConditions.push({ agencyName: { $regex: name, $options: 'i' } });
    }
    if (phone) {
      orConditions.push({ agencyPhone: { $regex: phone, $options: 'i' } });
    }
  }

  if (type === 'provider' || !type) {
    if (code) {
      orConditions.push({ providerCode: { $regex: code, $options: 'i' } });
    }
    if (name) {
      orConditions.push({ providerName: { $regex: name, $options: 'i' } });
    }
    if (phone) {
      orConditions.push({ providerPhone: { $regex: phone, $options: 'i' } });
    }
  }

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  let agencies = [];
  let providers = [];

  if (type === 'agency' || !type) {
    agencies = await Agency.find(query).limit(+limit).skip(skip).sort({ agencyName: 1 });
  }
  if (type === 'provider' || !type) {
    providers = await Provider.find(query).limit(+limit).skip(skip).sort({ providerName: 1 });
  }

  let supplies = [...agencies, ...providers];

  const totalResult = agencies.length + providers.length;

  return res.status(httpStatus.OK).json({
    message: "Supplies found",
    code: httpStatus.OK,
    data: {
      supplies,
      limit: +limit,
      page: +page,
      totalResult,
      totalPage: Math.ceil(totalResult / limit),
    },
  });
});

module.exports = {
  createdSupply,
  updatedSupply,
  deletedSupply,
  getSupplyById,
  getSupplies,
  searchSupply,
};