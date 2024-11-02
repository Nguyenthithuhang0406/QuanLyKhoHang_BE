//phieu xuat kho
const { Schema, default: mongoose } = require('mongoose');

const exportSlipSchema = new Schema({
  exportSlipCode: {
    type: String,
    required: true,
  },
  exportSlipDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  //nguon nhan
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
  //cho duyet, da duyet, tu choi, da xuất, hoàn hàng
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', "DONE", "RETURNED"],
    required: true,
    default: 'PENDING',
  },
  type: {
    type: String,
    enum: ["Agency", "Provider", "Customer"],
    required: true,
  },
  //gia xuat
  exportPrice: {
    type: String,
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    //số lượng xuat
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

const ExportSlip = mongoose.model('ExportSlip', exportSlipSchema);
module.exports = ExportSlip;
