const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "Too short  SubCategory name"],
      maxlength: [32, "Too long  SubCategory name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    // foriegn
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });

  next();
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
