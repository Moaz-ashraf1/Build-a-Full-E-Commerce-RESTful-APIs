// 1-Create Schema
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category must have a name"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
      unique: true,
    },
    image: String,
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne,findAll and update
CategorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

CategorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

// Create Model
const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
