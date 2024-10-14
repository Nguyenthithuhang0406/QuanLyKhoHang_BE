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
    required: true,
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
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED'],
    required: true,
    default: 'PENDING',
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
}, {
  timestamps: true,
});

const ImportSlip = mongoose.model('ImportSlip', importSlipSchema);
module.exports = ImportSlip;
