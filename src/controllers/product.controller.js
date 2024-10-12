
const httpStatus = require("http-status");
const Product = require("@/models/product.model");
const catchAsync = require("@/utils/catchAsync");
const ApiError = require("@/utils/apiError");

const createdProduct = catchAsync(async (req, res) => {
  const { productCode, productName, productGroup, productMedia, fileUrls, productDescription, productDVT, productPrice } = req.body;

  const existingProduct = await Product.findOne({ productCode: productCode });

  if (existingProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already exists");
  }

  const product = new Product({
    productCode,
    productName,
    productGroup,
    productMedia: fileUrls,
    productDescription,
    productDVT,
    productPrice,
  });

  await product.save();
  return res.status(httpStatus.CREATED).json({
    message: "Product created successfully",
    code: httpStatus.CREATED,
    data: {
      product,
    },
  });
});

const updatedProduct = catchAsync(async (req, res) => {
  const { productName, productGroup,productMedia, fileUrls, productDescription, productDVT, productPrice } = req.body;
  const { productId } = req.params;

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const updateProduct = {
    productName: productName ? productName : existingProduct.productName,
    productGroup: productGroup ? productGroup : existingProduct.productGroup,
    productMedia: fileUrls ? [...(Array.isArray(productName) ? productMedia : []), ...fileUrls] : productMedia,
    productDescription: productDescription ? productDescription : existingProduct.productDescription,
    productDVT: productDVT ? productDVT : existingProduct.productDVT,
    productPrice: productPrice ? productPrice : existingProduct.productPrice,
  }

  Object.assign(existingProduct, updateProduct);

  await existingProduct.save();

  return res.status(httpStatus.OK).json({
    message: "Product updated successfully",
    code: httpStatus.OK,
    data: {
      updateProduct,
    },
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  await existingProduct.deleteOne();
  
  return res.status(httpStatus.OK).json({
    message: "Product deleted successfully",
    code: httpStatus.OK,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  return res.status(httpStatus.OK).json({
    message: "Product found",
    code: httpStatus.OK,
    data: {
      product,
    },
  });
});

module.exports = {
  createdProduct,
  updatedProduct,
  deleteProduct,
  getProductById,
};