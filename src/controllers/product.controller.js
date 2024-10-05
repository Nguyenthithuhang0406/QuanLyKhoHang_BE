
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

module.exports = {
  createdProduct,
};