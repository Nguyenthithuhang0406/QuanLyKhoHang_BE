const { Schema, default: mongoose } = require('mongoose');

const productSchema = new Schema({
  productCode: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productGroup: {
    type: String,
    required: true,
  },
  productMedia: {
    type: [String],
    // required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productDVT: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productQuantityImport: {
    //số lượng đã nhập
    type: Number,
    default: 0,
  },
  productQuantityExport: {
    //số lượng đã bán
    type: Number,
    default: 0,
  },
  productQuantityRemaining: {
    //số lượng còn lại
    type: Number,
    default: 0,
  },
  dateOfManufacture: {
    //ngay san xuat
    type: Date,
  },
  expirationDate: {
    //han su dung
    type: Date,
  },
  // respository: {

  // },
  // supplierCode: {

  // },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;