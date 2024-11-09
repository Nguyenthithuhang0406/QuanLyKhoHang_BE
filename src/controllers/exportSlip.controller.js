const httpStatus = require("http-status");
const ExportSlip = require("../models/exportSlip.model");
const Product = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");

const createdExportSlip = catchAsync(async (req, res) => {
  const {
    exportSlipCode,
    providerId,
    userId,
    status,
    products,
    newProducts,
    contracts,
    type,
    reason,
    exportPrice,
  } = req.body;

  const listProductsBody = [];
  if (products && products.length > 0) {
    for (const product of products) {
      listProductsBody.push({
        productId: product.productId,
        quantity: product.quantity,
        discount: product.discount,
      });
    }
  }

  const createNewProducts = [];
  if (newProducts && newProducts.length > 0) {
    for (const product of newProducts) {
      //kiểm tra xem product đã tồn tại chưa
      const existingProduct = await Product.findOne({
        productName: product.productName,
      });

      if (existingProduct) {
        createNewProducts.push({
          productId: existingProduct._id,
          quantity: product.quantity,
          discount: product.discount,
        });
      } else {
        //Nếu chưa tồn tại thì tạo mới
        const newProduct = new Product({
          productCode: product.productCode,
          productName: product.productName,
          productGroup: product.productGroup,
          productMedia: product.productMedia,
          productDescription: product.productDescription,
          productDVT: product.productDVT,
          productPrice: product.productPrice,
        });

        await newProduct.save();
        createNewProducts.push({
          productId: newProduct._id,
          quantity: product.quantity,
          discount: product.discount,
        });
      }
    }
  }

  const allProducts = [...listProductsBody, ...createNewProducts];

  const uniqueProducts = Array.from(
    new Set(allProducts.map((p) => p.productId.toString()))
  ).map((productId) => {
    return allProducts.find((p) => p.productId.toString() === productId);
  });

  const exportSlip = new ExportSlip({
    exportSlipCode,
    userId,
    status,
    products: uniqueProducts,
    contracts,
    type,
    reason,
    exportPrice,
  });

  if (type === "Provider") {
    exportSlip.providerId = providerId;
  } else {
    if (type === "Agency") {
      exportSlip.agencyId = providerId;
    } else {
      exportSlip.customerId = providerId;
    }
  }

  await exportSlip.save();

  return res.status(httpStatus.CREATED).json({
    message: "Export slip created successfully",
    code: httpStatus.CREATED,
    data: {
      exportSlip,
    },
  });
});

const getExportSlipById = catchAsync(async (req, res) => {
  const { exportSlipId } = req.params;

  let exportSlip = await ExportSlip.findById(exportSlipId);

  if (!exportSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Export slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (exportSlip.type === "Provider") {
    exportSlip = await ExportSlip.findById(exportSlipId)
      .populate(
        "providerId",
        "providerCode providerName providerAddress providerPhone"
      )
      .populate("userId", "fullName")
      .populate("userEditStatus", "fullName")
      .populate("contracts", "contractContent contractMedia")
      .populate(
        "products.productId",
        "productCode productName productDVT productPrice"
      )
      .populate("userEditStatus", "fullName userName email phoneNumber role");
  } else {
    if (exportSlip.type === "Agency") {
      exportSlip = await ExportSlip.findById(exportSlipId)
        .populate("agencyId", "agencyCode agencyName agencyAddress agencyPhone")
        .populate("userId", "fullName")
        .populate("userEditStatus", "fullName")
        .populate("contracts", "contractContent contractMedia")
        .populate(
          "products.productId",
          "productCode productName productDVT productPrice"
        )
        .populate("userEditStatus", "fullName userName email phoneNumber role");
    } else {
      exportSlip = await ExportSlip.findById(exportSlipId)
        .populate("customerId", "customerName customerAddress customerPhone")
        .populate("userId", "fullName")
        .populate("userEditStatus", "fullName")
        .populate("contracts", "contractContent contractMedia")
        .populate(
          "products.productId",
          "productCode productName productDVT productPrice"
        )
        .populate("userEditStatus", "fullName userName email phoneNumber role");
    }
  }

  return res.status(httpStatus.OK).json({
    message: "Export slip found",
    code: httpStatus.OK,
    data: {
      exportSlip,
    },
  });
});

const deletedExportSlip = catchAsync(async (req, res) => {
  const { exportSlipId } = req.params;

  const exportSlip = await ExportSlip.findByIdAndDelete(exportSlipId);

  if (!exportSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Export slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Export slip deleted successfully",
    code: httpStatus.OK,
  });
});

const updatedStatusExportSlip = catchAsync(async (req, res) => {
  const { exportSlipId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const exportSlip = await ExportSlip.findById(exportSlipId);

  if (!exportSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Export slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  exportSlip.status = status;
  exportSlip.userEditStatus = userId;
  await exportSlip.save();

  if (status === "DONE") {
    for (const product of exportSlip.products) {
      const existingProduct = await Product.findById(product.productId);
      if (!existingProduct) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Product not found",
          code: httpStatus.NOT_FOUND,
        });
      }
      existingProduct.productQuantityExport += product.quantity;
      existingProduct.productQuantityRemaining -= product.quantity;
      await existingProduct.save();
    }
  }
  return res.status(httpStatus.OK).json({
    message: "Export slip updated successfully",
    code: httpStatus.OK,
    data: {
      exportSlip,
    },
  });
});

const getExportSlipByType = catchAsync(async (req, res) => {
  const { type, limit = 10, page = 1 } = req.query;

  const skip = (+page - 1) * +limit;
  let exportSlip;

  if (type === "Provider") {
    exportSlip = await ExportSlip.find({ type })
      .limit(+limit)
      .skip(skip)
      .populate("providerId", "providerName")
      .sort({ providerName: 1 });
  }

  if (type === "Agency") {
    exportSlip = await ExportSlip.find({ type })
      .limit(+limit)
      .skip(skip)
      .populate("agencyId", "agencyName")
      .sort({ agencyName: 1 });
  }

  if (type === "Customer") {
    exportSlip = await ExportSlip.find({ type })
      .limit(+limit)
      .skip(skip)
      .populate("customerId", "customerName")
      .sort({ customerName: 1 });
  }

  if (!exportSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Export slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  const totalResult = await ExportSlip.countDocuments({ type });

  return res.status(httpStatus.OK).json({
    message: "Get exportSlip successfully",
    code: httpStatus.OK,
    data: {
      exportSlip,
      limit: +limit,
      page: +page,
      totalResult,
      totalPage: Math.ceil(totalResult / limit),
    },
  });
});

const searchExportSlips = catchAsync(async (req, res) => {
  const {
    exportSlipCode,
    providerId,
    agencyId,
    customerId,
    limit = 10,
    page = 1,
    status,
    timeStart,
    timeEnd,
    type,
  } = req.query;

  const query = {};

  if (exportSlipCode) {
    query.exportSlipCode = { $regex: exportSlipCode, $options: "i" };
  }

  if (type) {
    query.type = type;
  }

  if (providerId) {
    query.providerId = providerId;
  }

  if (agencyId) {
    query.agencyId = agencyId;
  }

  if (customerId) {
    query.customerId = customerId;
  }

  if (status) {
    query.status = status;
  }

  if (timeStart && timeEnd) {
    query.createdAt = { $gte: new Date(timeStart), $lte: new Date(timeEnd) };
  }

  const skip = (+page - 1) * +limit;

  let exportSlips;
  if (type === "Provider") {
    exportSlips = await ExportSlip.find(query)
      .limit(+limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("providerId", "providerName")
      .sort({ providerName: 1 });
  }

  if (type === "Agency") {
    exportSlips = await ExportSlip.find(query)
      .limit(+limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("agencyId", "agencyName")
      .sort({ agencyName: 1 });
  }

  if (type === "Customer") {
    exportSlips = await ExportSlip.find(query)
      .limit(+limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("customerId", "customerName")
      .sort({ customerName: 1 });
  }

  const totalResult = await ExportSlip.countDocuments(query);

  return res.status(httpStatus.OK).json({
    message: "Get ExportSlips successfully",
    code: httpStatus.OK,
    data: {
      exportSlips,
      limit: +limit,
      page: +page,
      totalResult,
      totalPage: Math.ceil(totalResult / +limit),
    },
  });
});

module.exports = {
  createdExportSlip,
  getExportSlipById,
  deletedExportSlip,
  updatedStatusExportSlip,
  getExportSlipByType,
  searchExportSlips,
};
