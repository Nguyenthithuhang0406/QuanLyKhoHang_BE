const { Schema, default: mongoose } = require('mongoose');

const customerSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
  },
}, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;