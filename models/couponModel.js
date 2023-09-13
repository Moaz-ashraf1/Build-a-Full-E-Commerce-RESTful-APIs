const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: true,
    },

    expire: {
      type: Date,
      required: [true, "Coupon expiration date required"],
    },

    discount: {
      type: Number,
      required: [true, "Coupon discount required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
