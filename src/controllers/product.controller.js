
const httpStatus = require("http-status");
const Product = require("@/models/product.model");
const catchAsync = require("@/utils/catchAsync");
const ApiError = require("@/utils/apiError");

const createdProduct = catchAsync(async (req, res) => {
  const { productCode, productName, productGroup, fileUrls, productDescription, productDVT, productPrice } = req.body;

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

const getProducts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'productName:asc' } = req.query;
  
  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'desc' ? -1 : 1 };
  
  const query = {};

  const products = await Product.find().limit(+limit).skip(skip).sort(sort);

  const totalResult = await Product.countDocuments(query);

  return res.status(httpStatus.OK).json({
    message: "Get products successfully",
    code: httpStatus.OK,
    data: {
      products,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResult / +limit),
      totalResult,
    },
  });
});

const searchProduct = catchAsync(async (req, res) => {
  const { productCode, productName, limit = 10, page = 1, sortBy ='productName:asc' } = req.query;

  const query = {};
  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'desc' ? -1 : 1 };

  query.$or = [];

  if (productCode) {
    query.$or.push({ productCode: { $regex: productCode, $options: "i" } });
  }

  if (productName) {
    query.$or.push({ productName: { $regex: productName, $options: "i" } });
  }

  if (query.$or.length === 0) {
    delete query.$or;
  }

  const skip = (+page - 1) * +limit;

  const products = await Product.find(query).limit(+limit).skip(skip).sort(sort);

  const totalResult = await Product.countDocuments(query);

  return res.status(httpStatus.OK).json({
    message: "Get products successfully",
    code: httpStatus.OK,
    data: {
      products,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResult / +limit),
      totalResult,
    },
  });
});


module.exports = {
  createdProduct,
  updatedProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProduct,
};