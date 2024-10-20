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
    message: "Import slip created successfully",
    code: httpStatus.CREATED,
    data: {
      exportSlip,
    },
  });
});

module.exports = {
  createdExportSlip,
};
