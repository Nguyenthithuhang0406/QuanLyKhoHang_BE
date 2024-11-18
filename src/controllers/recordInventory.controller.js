const RecordInventory = require("../models/recordInventory.model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const httpStatus = require("http-status");

const createdRecordInventory = catchAsync(async (req, res) => {
  const {
    recordInventoryCode,
    recordInventoryDate,
    agencyId,
    purpose,
    userId,
    products,
  } = req.body;

  const existingRecordInventory = await RecordInventory.findOne({
    recordInventoryCode: recordInventoryCode,
  });

  if (existingRecordInventory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Record Inventory already exists"
    );
  }

  const recordInventory = new RecordInventory({
    recordInventoryCode,
    recordInventoryDate: new Date(recordInventoryDate) || Date.now(),
    agencyId,
    purpose,
    userId,
    products,
  });

  await recordInventory.save();

  return res.status(httpStatus.CREATED).json({
    message: "Record Inventory created successfully",
    code: httpStatus.CREATED,
    data: {
      recordInventory,
    },
  });
});

const updatedStatusRecordInventory = catchAsync(async (req, res) => {
  const { recordInventoryId } = req.params;
  const { status, userId } = req.body;

  const existingRecordInventory = await RecordInventory.findById(
    recordInventoryId
  );

  if (!existingRecordInventory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record Inventory not found");
  }

  existingRecordInventory.status = status;
  existingRecordInventory.updatedAt = Date.now();
  existingRecordInventory.userEditStatus = userId;

  await existingRecordInventory.save();

  return res.status(httpStatus.OK).json({
    message: "Record Inventory updated successfully",
    code: httpStatus.OK,
    data: {
      recordInventory: existingRecordInventory,
    },
  });
});

const deletedRecordInventory = catchAsync(async (req, res) => {
  const { recordInventoryId } = req.params;

  const existingRecordInventory = await RecordInventory.findById(
    recordInventoryId
  );

  if (!existingRecordInventory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record Inventory not found");
  }

  await existingRecordInventory.deleteOne();

  return res.status(httpStatus.OK).json({
    message: "Record Inventory deleted successfully",
    code: httpStatus.OK,
  });
});

const getRecordInventoryById = catchAsync(async (req, res) => {
  const { recordInventoryId } = req.params;

  const recordInventory = await RecordInventory.findById(recordInventoryId)
    .populate("agencyId", "agencyName")
    .populate("userId", "fullName")
    .populate("userEditStatus", "fullName")
    .populate(
      "products.productId",
      "productName productCode productDVT productPrice"
    );

  if (!recordInventory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record Inventory not found");
  }

  return res.status(httpStatus.OK).json({
    message: "Get record inventory successfully",
    code: httpStatus.OK,
    data: {
      recordInventory,
    },
  });
});

const getRecordInventories = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (+page - 1) * +limit;

  const recordInventories = await RecordInventory.find()
    .limit(+limit)
    .skip(skip);

  const totalResult = await RecordInventory.countDocuments();

  return res.status(httpStatus.OK).json({
    message: "Get all record inventories successfully",
    code: httpStatus.OK,
    data: {
      recordInventories,
      totalResult,
      page: +page,
      limit: +limit,
      totalPage: Math.ceil(totalResult / limit),
    },
  });
});

const searchRecordInventory = catchAsync(async (req, res) => {
  const {
    recordInventoryCode,
    status,
    timeStart,
    timeEnd,
    limit = 10,
    page = 1,
  } = req.query;

  const skip = (+page - 1) * +limit;

  const query = {};
  query.$or = [];
  if (recordInventoryCode) {
    query.$or.push({ recordInventoryCode: { $regex: recordInventoryCode } });
  }

  if (status) {
    query.$or.push({ status: { $regex: status } });
  }

  if (timeStart && timeEnd) {
    query.recordInventoryDate = {
      $gte: new Date(timeStart),
      $lte: new Date(timeEnd),
    };
  }

  if (query.$or.length === 0) {
    delete query.$or;
  }

  const recordInventories = await RecordInventory.find(query)
    .limit(+limit)
    .skip(skip);

  const totalResult = await RecordInventory.countDocuments(query);

  return res.status(httpStatus.OK).json({
    message: "Search record inventories successfully",
    code: httpStatus.OK,
    data: {
      recordInventories,
      totalResult,
      page: +page,
      limit: +limit,
      totalPage: Math.ceil(totalResult / limit),
    },
  });
});

module.exports = {
  createdRecordInventory,
  updatedStatusRecordInventory,
  deletedRecordInventory,
  getRecordInventoryById,
  getRecordInventories,
  searchRecordInventory,
};
