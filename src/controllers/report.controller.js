const httpStatus = require("http-status");
const ImportSlip = require("../models/importSlip.model");
const catchAsync = require("../utils/catchAsync");
const ExportSlip = require("../models/exportSlip.model");
const Product = require("../models/product.model");

const reportExportImportInventory = catchAsync(async (req, res) => {
  const { timeStart, timeEnd } = req.query;

  // Thiết lập khoảng thời gian
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const query = {
    createdAt: {
      $gte: timeStart ? new Date(timeStart) : startOfMonth,
      $lte: timeEnd ? new Date(timeEnd) : endOfMonth,
    },
  };

  // Aggregation để tính số lượng nhập
  const importData = await ImportSlip.aggregate([
    { $match: query },
    // $unwind để tách các sản phẩm ra thành từng dòng
    { $unwind: "$products" },
    // $group để nhóm các sản phẩm theo productId và tính tổng số lượng nhập
    {
      $group: {
        _id: "$products.productId",
        totalImport: { $sum: "$products.quantity" },
      },
    },
  ]);

  // Aggregation để tính số lượng xuất
  const exportData = await ExportSlip.aggregate([
    { $match: query },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalExport: { $sum: "$products.quantity" },
      },
    },
  ]);

  // Ghép dữ liệu nhập/xuất thành một map
  const productMap = new Map();
  importData.forEach((item) => {
    productMap.set(item._id.toString(), {
      import: item.totalImport,
      export: 0,
    });
  });
  exportData.forEach((item) => {
    const product = productMap.get(item._id.toString()) || {
      import: 0,
      export: 0,
    };
    product.export = item.totalExport;
    productMap.set(item._id.toString(), product);
  });

  // Lấy danh sách sản phẩm và tính số lượng tồn kho
  const productIds = Array.from(productMap.keys());
  const productInfo = await Product.find(
    { _id: { $in: productIds } },
    "productName productCode"
  );

  const products = productInfo.map((product) => {
    const data = productMap.get(product._id.toString());
    return {
      productId: product._id,
      productName: product.productName,
      productCode: product.productCode,
      importQuantity: data.import,
      exportQuantity: data.export,
      inventoryQuantity: data.import - data.export,
    };
  });

  // Sắp xếp theo số lượng nhập giảm dần
  products.sort((a, b) => b.importQuantity - a.importQuantity);

  return res.status(httpStatus.OK).json({
    message: "Report export import inventory successfully",
    code: httpStatus.OK,
    products,
  });
});


module.exports = {
  // reportImport,
  reportExportImportInventory,
};
