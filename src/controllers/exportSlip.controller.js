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
  } = req.body;

  const listProductsBody = [];
  if (products && products.length > 0) {
    for (const product of products) {
      listProductsBody.push({
        productId: product._id,
        quantity: product.quantity,
        discount: product.discount
      });
    }
  }

  const createNewProducts = [];
  if (newProducts && newProducts.length > 0) {
    for (const product of newProducts) {
      //kiểm tra xem product đã tồn tại chưa
      const existingProduct = await Product.findOne({ productName: product.productName });

      if (existingProduct) {
        createNewProducts.push({
          productId: existingProduct._id,
          quantity: product.quantity,
          discount: product.discount
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
          discount: product.discount
        });
      }
    }
  }

  const allProducts = [...listProductsBody, ...createNewProducts];

  const uniqueProducts = Array.from(new Set(allProducts.map(p => p.productId.toString())))
    .map(productId => {
      return allProducts.find(p => p.productId.toString() === productId);
    });

  const exportSlip = new ExportSlip({
    exportSlipCode,
    userId,
    status,
    products: uniqueProducts,
    contracts,
    type,
    reason,
  });

  if (type === "Provider") {
    exportSlip.providerId = providerId;
  } else {
    if (type === "Agency") {
      exportSlip.agencyId = providerId;
    } else {
      exportSlip.customerId = providerId;
    }
  };

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
      .populate("providerId", "providerCode providerName providerAddress providerPhone")
      .populate("userId", "fullName")
      .populate("userEditStatus", "fullName")
      .populate("contracts", "contractContent contractMedia")
      .populate("products.productId", "productCode productName productDVT productPrice");

  } else {
    if (exportSlip.type === "Agency") {
      exportSlip = await ExportSlip.findById(exportSlipId)
        .populate("agencyId", "agencyCode agencyName agencyAddress agencyPhone")
        .populate("userId", "fullName")
        .populate("userEditStatus", "fullName")
        .populate("contracts", "contractContent contractMedia")
        .populate("products.productId", "productCode productName productDVT productPrice");
    } else {
      exportSlip = await ExportSlip.findById(exportSlipId)
        .populate("customerId", "customerName customerAddress customerPhone")
        .populate("userId", "fullName")
        .populate("userEditStatus", "fullName")
        .populate("contracts", "contractContent contractMedia")
        .populate("products.productId", "productCode productName productDVT productPrice");
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

  const exportSlip = await ExportSlip.findById(exportSlipId);

  if (!exportSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Export slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  exportSlip.status = status;
  await exportSlip.save();

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
    exportSlip = await ExportSlip.find({ type }).limit(+limit).skip(skip).populate("providerId", "providerName").sort({ providerName: 1 });
  };

  if (type === "Agency") {
    exportSlip = await ExportSlip.find({ type }).limit(+limit).skip(skip).populate("agencyId", "agencyName").sort({ agencyName: 1 });
  }

  if (type === "Customer") {
    exportSlip = await ExportSlip.find({ type }).limit(+limit).skip(skip).populate("customerId", "customerName").sort({ customerName: 1 });
  }

  if (!exportSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Export slip not found",
      code: httpStatus.NOT_FOUND,
    });
  };

  const totalResult = exportSlip.length;

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
  const { exportSlipCode, providerId, agencyId, customerId, limit = 10, page = 1, status, timeStart, timeEnd } = req.query;

  const query = { $or: [] };

  if (exportSlipCode) {
    query.$or.push({ exportSlipCode: { $regex: exportSlipCode, $options: 'i' } });
  }

  if (providerId) {
    query.$or.push({ providerId });
  }

  if (agencyId) {
    query.$or.push({ agencyId });
  }

  if (customerId) {
    query.$or.push({ customerId });
  }

  if (status) {
    query.$or.push({ status: { $regex: status, $options: 'i' } });
  }

  if (timeStart && timeEnd) {
    query.$or.push({ createdAt: { $gte: timeStart, $lte: timeEnd } });
  }

  //neu khong co dieu kien tim kiem thi xoa $or de tranh truy van trong, khi do se tra ve tat ca cac phieu nhap
  if (query.$or.length === 0) {
    delete query.$or;
  }
  const skip = (+page - 1) * +limit;

  const exportSlips = await ExportSlip.find(query).limit(+limit).skip(skip).sort({ createdAt: -1 });

  const totalResult = exportSlips.length;

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
