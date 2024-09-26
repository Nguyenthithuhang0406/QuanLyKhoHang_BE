const { Schema, default: mongoose } = require('mongoose');

const userSchema = new Schema({
  staffCode: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  role: {
    type: String,
    required: true,
    emum: ['manager', 'staff'],
    default: 'staff',
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  gender: {
    type: String,
    enum: ['male', 'fermale', 'other'],
  },
  avatar: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

