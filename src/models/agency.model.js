const { Schema, default: mongoose } = require('mongoose');

//đại lý
const agencySchema = new Schema({
  agencyCode: {
    type: String,
    required: true,
  },
  agencyName: {
    type: String,
    required: true,
  },
  agencyAddress: {
    type: String,
    required: true,
  },
  agencyPhone: {
    type: String,
    required: true,
  },
  agencyEmail: {
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

const Agency = mongoose.model('Agency', agencySchema);
module.exports = Agency;

