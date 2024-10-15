const { Schema, default: mongoose } = require('mongoose');

const contractSchema = new Schema({
  contractContent: {
    type: String,
    required: true,
  },
  contractMedia: {
    type: [String],
    required: true,
  },
});

const Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;