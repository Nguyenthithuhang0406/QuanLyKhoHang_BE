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
    for(const product of newProducts) {
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

  const importSlip = new ImportSlip({
    importSlipCode,
    userId,
    status,
    products: uniqueProducts,
    contracts,
    type,
    reason,
  });

  if (type === "Provider") {
    importSlip.providerId = providerId;
  } else {
    if (type === "Agency") {
      importSlip.agencyId = providerId;
    } else {
      importSlip.customerId = providerId;
    }
  };

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
      .populate("providerId", "providerCode providerName providerAddress providerPhone")
      .populate("userId", "fullName")
      .populate("userEditStatus", "fullName")
      .populate("contracts", "contractContent contractMedia")
      .populate("products.productId", "productCode productName productDVT productPrice");

  } else {
    if (importSlip.type === "Agency") {
      importSlip = await ImportSlip.findById(importSlipId)
        .populate("agencyId", "agencyCode agencyName agencyAddress agencyPhone")
        .populate("userId", "fullName")
        .populate("userEditStatus", "fullName")
        .populate("contracts", "contractContent contractMedia")
        .populate("products.productId", "productCode productName productDVT productPrice");
    } else {
      importSlip = await ImportSlip.findById(importSlipId)
        .populate("customerId", "customerName customerAddress customerPhone")
        .populate("userId", "fullName")
        .populate("userEditStatus", "fullName")
        .populate("contracts", "contractContent contractMedia")
        .populate("products.productId", "productCode productName productDVT productPrice");
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

module.exports = {
  createdImportSlip,
  getImportSlipById,
  deletedImportSlip,
};