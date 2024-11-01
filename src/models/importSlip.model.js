//phieu nhap kho
const { Schema, default: mongoose } = require('mongoose');

const importSlipSchema = new Schema({
  importSlipCode: {
    type: String,
    required: true,
  },
  importSlipDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEditStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  //cho duyet, da duyet, tu choi, da nhap
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', "DONE"],
    required: true,
    default: 'PENDING',
  },
  type: {
    type: String,
    enum: ["Agency", "Provider", "Customer"],
    required: true,
  },
  importPrice: {
    type: String,
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    //số lượng nhập
    quantity: {
      type: Number,
      required: true,
    },
    //chiet khau
    discount: {
      type: Number,
      required: true,
    },
  }],
  contracts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
  },
  editStatusAt: {
    type: Date,
  },
  reason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const ImportSlip = mongoose.model('ImportSlip', importSlipSchema);
module.exports = ImportSlip;
