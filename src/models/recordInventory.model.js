//phieu nhap kho
const { Schema, default: mongoose } = require("mongoose");

const recordInventorySchema = new Schema(
  {
    recordInventoryCode: {
      type: String,
      required: true,
    },
    recordInventoryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
    purpose: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEditStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //cho duyet, da duyet, tu choi
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      required: true,
      default: "PENDING",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        //số lượng hệ thống
        numberOfSystem: {
          type: Number,
          required: true,
        },
        //số lượng thực tế
        numberOfReality: {
          type: Number,
          required: true,
        },
        //chênh lệch
        difference: {
          type: Number,
          required: true,
        },
        //xử lý
        solution: {
          type: String,
        },
      },
    ],
    editStatusAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const RecordInventory = mongoose.model(
  "RecordInventory",
  recordInventorySchema
);
module.exports = RecordInventory;
