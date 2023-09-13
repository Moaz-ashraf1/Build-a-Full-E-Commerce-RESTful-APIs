const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product must have a title "],
      trim: true,
      minlength: [3, "To short Product title"],
      maxlength: [100, "To long Product title"],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    colors: [String],

    description: {
      type: String,
      required: [true, "product must have description"],
      minlength: [20, "Too short product description"],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "product must have price"],
      trim: true,
      max: [20000, "Too long product price"],
    },

    priceAfterDiscount: {
      type: Number,
    },

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },

    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Product must be belong to category"],
      ref: "Category",
    },

    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "Rating must above or equal 1.0"],
      max: [5, "Rating must below or equal 5.0"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtula Population
ProductSchema.virtual("review", {
  localField: "_id",
  foreignField: "product",
  ref: "Review",
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/products/${image}`
    );
  }
};

ProductSchema.post("init", (doc) => {
  setImageUrl(doc);
});

ProductSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", ProductSchema);
