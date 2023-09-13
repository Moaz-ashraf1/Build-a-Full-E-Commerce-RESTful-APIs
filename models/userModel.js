const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "name required"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      require: [true, "email required"],
      unique: true,
    },

    password: {
      type: String,
      require: [true, "password required"],
      minlength: [6, "Too short password "],
    },
    changePasswordAt: Date,
    passwordResetCode: String,
    passwordExpTime: Date,
    passwordResetVerified: Boolean,

    phone: String,
    profileImage: String,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
