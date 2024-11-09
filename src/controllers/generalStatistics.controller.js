const httpStatus = require("http-status");
const ExportSlip = require("../models/exportSlip.model");
const ImportSlip = require("../models/importSlip.model");
const catchAsync = require("../utils/catchAsync");

const importExportRatio = catchAsync(async (req, res) => {
  const { timeStart, timeEnd } = req.query;

  let importQuantity = 0;
  let exportQuantity = 0;
  let importSlips;
  let exportSlips;

  if (timeStart && timeEnd) {
    const query = {};
    query.createdAt = { $gte: new Date(timeStart), $lte: new Date(timeEnd) };

    importSlips = await ImportSlip.find(query);
    exportSlips = await ExportSlip.find(query);
  } else {
    importSlips = await ImportSlip.find();
    exportSlips = await ExportSlip.find();
  }

  importSlips.forEach((importSlip) => {
    importSlip.products.forEach((product) => {
      importQuantity += product.quantity;
    });
  });

  exportSlips.forEach((exportSlip) => {
    exportSlip.products.forEach((product) => {
      exportQuantity += product.quantity;
    });
  });

  return res.status(httpStatus.OK).json({
    importQuantity,
    exportQuantity,
    importExportRatio: exportQuantity / importQuantity,
  });
});

const exportWithSource = catchAsync(async (req, res) => {
  const { timeStart, timeEnd } = req.query;

  let exportWithProvider = 0;
  let exportWithAgency = 0;
  let exportWithCustomer = 0;
  let exportSlips;

  if (timeStart && timeEnd) {
    const query = {};
    query.createdAt = { $gte: new Date(timeStart), $lte: new Date(timeEnd) };
    exportSlips = await ExportSlip.find(query);
  } else {
    exportSlips = await ExportSlip.find();
  }

  exportSlips.forEach((exportSlip) => {
    exportSlip.products.forEach((product) => {
      if (exportSlip.type === "Provider") {
        exportWithProvider += product.quantity;
      } else if (exportSlip.type === "Agency") {
        exportWithAgency += product.quantity;
      } else {
        exportWithCustomer += product.quantity;
      }
    });
  });

  return res.status(httpStatus.OK).json({
    exportWithProvider,
    exportWithAgency,
    exportWithCustomer,
  });
});

const importWithSource = catchAsync(async (req, res) => {
  const { timeStart, timeEnd } = req.query;

  let importWithProvider = 0;
  let importWithAgency = 0;
  let importWithCustomer = 0;
  let importSlips;

  if (timeStart && timeEnd) {
    const query = {};
    query.createdAt = { $gte: new Date(timeStart), $lte: new Date(timeEnd) };
    importSlips = await ImportSlip.find(query);
  } else {
    importSlips = await ImportSlip.find();
  }

  importSlips.forEach((importSlip) => {
    importSlip.products.forEach((product) => {
      if (importSlip.type === "Provider") {
        importWithProvider += product.quantity;
      } else if (importSlip.type === "Agency") {
        importWithAgency += product.quantity;
      } else {
        importWithCustomer += product.quantity;
      }
    });
  });

  return res.status(httpStatus.OK).json({
    importWithProvider,
    importWithAgency,
    importWithCustomer,
  });
});

module.exports = {
  importExportRatio,
  exportWithSource,
  importWithSource,
};
