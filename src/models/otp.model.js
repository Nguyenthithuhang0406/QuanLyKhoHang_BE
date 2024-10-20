const { Schema, default: mongoose } = require('mongoose');

const otpSchema = new Schema({
  otp: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '20m',
  },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;