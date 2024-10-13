const { Schema, default: mongoose } = require('mongoose');

const providerSchema = new Schema({
  providerCode: {
    type: String,
    required: true,
  },
  providerName: {
    type: String,
    required: true,
  },
  providerAddress: {
    type: String,
    required: true,
  },
  providerPhone: {
    type: String,
    required: true,
  },
  providerEmail: {
    type: String,
    required: true,
  },
  //người đại diện
  representative: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Provider = mongoose.model('Provider', providerSchema);
module.exports = Provider;