const httpStatus = require("http-status");
const ImportSlip = require("../models/importSlip.model");
const Product = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");

const createdImportSlip = catchAsync(async (req, res) => {
  const {
    importSlipCode,
    providerId,
    userId,
    status,
    products,
    newProducts,
    contracts,
    type,
    reason,
    importPrice,
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

  const importSlip = new ImportSlip({
    importSlipCode,
    userId,
    status,
    products: uniqueProducts,
    contracts,
    type,
    reason,
    importPrice,
  });

  if (type === "Provider") {
    importSlip.providerId = providerId;
  } else {
    if (type === "Agency") {
      importSlip.agencyId = providerId;
    } else {
      importSlip.customerId = providerId;
    }
  }

  await importSlip.save();

  return res.status(httpStatus.CREATED).json({
    message: "Import slip created successfully",
    code: httpStatus.CREATED,
    data: {
      importSlip,
    },
  });
});

const getImportSlipById = catchAsync(async (req, res) => {
  const { importSlipId } = req.params;

  let importSlip = await ImportSlip.findById(importSlipId);

  if (!importSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Import slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  if (importSlip.type === "Provider") {
    importSlip = await ImportSlip.findById(importSlipId)
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
    if (importSlip.type === "Agency") {
      importSlip = await ImportSlip.findById(importSlipId)
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
      importSlip = await ImportSlip.findById(importSlipId)
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
    message: "Import slip found",
    code: httpStatus.OK,
    data: {
      importSlip,
    },
  });
});

const deletedImportSlip = catchAsync(async (req, res) => {
  const { importSlipId } = req.params;

  const importSlip = await ImportSlip.findByIdAndDelete(importSlipId);

  if (!importSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Import slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).json({
    message: "Import slip deleted successfully",
    code: httpStatus.OK,
  });
});

const updatedStatusImportSlip = catchAsync(async (req, res) => {
  const { importSlipId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const importSlip = await ImportSlip.findById(importSlipId);

  if (!importSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Import slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  importSlip.status = status;
  importSlip.userEditStatus = userId;
  await importSlip.save();

  if (status === "DONE") {
    for (const product of importSlip.products) {
      const existingProduct = await Product.findById(product.productId);
      if (!existingProduct) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Product not found",
          code: httpStatus.NOT_FOUND,
        });
      }
      existingProduct.productQuantityImport += product.quantity;
      existingProduct.productQuantityRemaining += product.quantity;
      await existingProduct.save();
    }
  }
  return res.status(httpStatus.OK).json({
    message: "Import slip updated successfully",
    code: httpStatus.OK,
    data: {
      importSlip,
    },
  });
});

const getImportSlipByType = catchAsync(async (req, res) => {
  const { type, limit = 10, page = 1 } = req.query;

  const skip = (+page - 1) * +limit;
  let importSlip;

  if (type === "Provider") {
    importSlip = await ImportSlip.find({ type })
      .limit(+limit)
      .skip(skip)
      .populate("providerId", "providerName")
      .sort({ providerName: 1 });
  }

  if (type === "Agency") {
    importSlip = await ImportSlip.find({ type })
      .limit(+limit)
      .skip(skip)
      .populate("agencyId", "agencyName")
      .sort({ agencyName: 1 });
  }

  if (type === "Customer") {
    importSlip = await ImportSlip.find({ type })
      .limit(+limit)
      .skip(skip)
      .populate("customerId", "customerName")
      .sort({ customerName: 1 });
  }

  if (!importSlip) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "Import slip not found",
      code: httpStatus.NOT_FOUND,
    });
  }

  const totalResult = await ImportSlip.countDocuments({ type });

  return res.status(httpStatus.OK).json({
    message: "Get importSlip successfully",
    code: httpStatus.OK,
    data: {
      importSlip,
      limit: +limit,
      page: +page,
      totalResult,
      totalPage: Math.ceil(totalResult / limit),
    },
  });
});

const searchImportSlips = catchAsync(async (req, res) => {
  const {
    importSlipCode,
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

  if (importSlipCode) {
    query.importSlipCode = { $regex: importSlipCode, $options: "i" };
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

  //neu khong co dieu kien tim kiem thi xoa $or de tranh truy van trong, khi do se tra ve tat ca cac phieu nhap

  const skip = (+page - 1) * +limit;

  let importSlips;
  if (type === "Provider") {
    importSlips = await ImportSlip.find(query)
      .limit(+limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("providerId", "providerName")
      .sort({ providerName: 1 });
  } else {
    if (type === "Agency") {
      importSlips = await ImportSlip.find(query)
        .limit(+limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("agencyId", "agencyName")
        .sort({ agencyName: 1 });
    } else {
      importSlips = await ImportSlip.find(query)
        .limit(+limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("customerId", "customerName")
        .sort({ customerName: 1 });
    }
  }

  const totalResult = await ImportSlip.countDocuments(query);

  return res.status(httpStatus.OK).json({
    message: "Get importSlips successfully",
    code: httpStatus.OK,
    data: {
      importSlips,
      limit: +limit,
      page: +page,
      totalResult,
      totalPage: Math.ceil(totalResult / +limit),
    },
  });
});

module.exports = {
  createdImportSlip,
  getImportSlipById,
  deletedImportSlip,
  updatedStatusImportSlip,
  getImportSlipByType,
  searchImportSlips,
};
