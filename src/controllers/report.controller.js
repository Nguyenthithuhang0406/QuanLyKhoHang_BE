const httpStatus = require("http-status");
const ImportSlip = require("../models/importSlip.model");
const catchAsync = require("../utils/catchAsync");
const ExportSlip = require("../models/exportSlip.model");
const Product = require("../models/product.model");

// const reportImport = catchAsync(async (req, res) => {
//   const { timeStart, timeEnd } = req.query;
//   const query = {};
//   if (timeStart && timeEnd) {
//     query.createdAt = { $gte: new Date(timeStart), $lte: new Date(timeEnd) };
//   } else {
//     const now = new Date();
//     //ngay bat dau la ngay dau thang cua thang hien tai
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     //ngay ket thuc la ngay cuoi thang hien tai
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//     //dieu kien truy van
//     query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
//   }

//   //loc cac phieu nhap theo thoi gian
//   const importSlips = await ImportSlip.find(query);
//   //tinh tong so luong nhap cua tung san pham trong cac phieu nhap
//   let mapQuantity = new Map();
//   importSlips.forEach((importSlip) => {
//     importSlip.products.forEach((product) => {
//       const quantity = mapQuantity.get(product.productId) || 0;
//       mapQuantity.set(product.productId, quantity + product.quantity);
//     });
//   });

//   //chuyen doi map sang array
//   const importProducts = [];
//   for (const [productId, quantity] of mapQuantity) {
//     importProducts.push({ productId, quantity });
//   }

//   //sap xep lai array theo so luong giam dan
//   importProducts.sort((a, b) => b.quantity - a.quantity);

//   return res.status(httpStatus.OK).json({
//     message: "Report import successfully",
//     code: httpStatus.OK,
//     importProducts
//   });
// });

const reportExportImportInventory = catchAsync(async (req, res) => {
  const { timeStart, timeEnd } = req.query;
  const query = {};
  if (timeStart && timeEnd) {
    query.createdAt = { $gte: new Date(timeStart), $lte: new Date(timeEnd) };
  } else {
    const now = new Date();
    //ngay bat dau la ngay dau thang cua thang hien tai
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //ngay ket thuc la ngay cuoi thang hien tai
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    //dieu kien truy van
    query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
  }

  //loc cac phieu nhap theo thoi gian
  const importSlips = await ImportSlip.find(query);
  //tinh tong so luong nhap cua tung san pham trong cac phieu nhap
  let mapImportQuantity = new Map();
  importSlips.forEach((importSlip) => {
    importSlip.products.forEach((product) => {
      const quantity = mapImportQuantity.get(product.productId) || 0;
      mapImportQuantity.set(product.productId, quantity + product.quantity);
    });
  });

  //loc cac phieu xuat theo thoi gian
  const exportSlips = await ExportSlip.find(query);
  //tinh tong so luong xuat cua tung san pham trong cac phieu xuat
  let mapExportQuantity = new Map();
  exportSlips.forEach((exportSlip) => {
    exportSlip.products.forEach((product) => {
      const quantity = mapExportQuantity.get(product.productId) || 0;
      mapExportQuantity.set(product.productId, quantity + product.quantity);
    });
  });

  //tinh so luong ton kho cua tung san pham
  const inventoryProducts = [];
  for (const [productId, importQuantity] of mapImportQuantity) {
    const exportQuantity = mapExportQuantity.get(productId) || 0;
    const inventoryQuantity = importQuantity - exportQuantity;
    inventoryProducts.push({ productId, inventoryQuantity });
  }

  //gop cac san pham vao 1 mang, moi san pham gom co so luong nhap, xuat, ton kho
  const products = [];
  for (const product of inventoryProducts) {
    const importQuantity = mapImportQuantity.get(product.productId);
    const exportQuantity = mapExportQuantity.get(product.productId) || 0;
    products.push({
      productId: product.productId,
      importQuantity,
      exportQuantity,
      inventoryQuantity: product.inventoryQuantity,
    });
  }

  //populate ten san pham
  for (const product of products) {
    const productInfo = await Product.findById(product.productId).populate(
      "_id",
      "productName productCode"
    );
    if (productInfo) {
      product.productName = productInfo.productName;
      product.productCode = productInfo.productCode;
    }
  }

  //sap xep lai theo so luong nhap giam dan
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
