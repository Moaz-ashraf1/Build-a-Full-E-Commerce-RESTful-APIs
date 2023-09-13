const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },

    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
      required: [true, "review rating required"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Review must belong to user"],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      require: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAvgRatingAndRatingQuantity = async function (
  productId
) {
  const results = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: productId,
        avergeRating: { $avg: "$ratings" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (results.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: results[0].ratingQuantity,
      ratingsAverage: results[0].avergeRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }

  console.log(results);
};
reviewSchema.post("save", async function () {
  //this ---> document
  // this.constructor ---> model
  await this.constructor.calcAvgRatingAndRatingQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
