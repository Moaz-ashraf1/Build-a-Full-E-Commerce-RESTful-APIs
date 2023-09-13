// 1-Create Schema
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand must have a name"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne,findAll and update
BrandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

BrandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2-Create Model

const BrandModel = mongoose.model("Brand", BrandSchema);
module.exports = BrandModel;
