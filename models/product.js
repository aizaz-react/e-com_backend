const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxLength: 1048,
  },
  price: { type: Number, required: true, maxLength: 10 },
  sellerId: { type: mongoose.Schema.ObjectId, required: true },
});




module.exports = mongoose.model("Product", productSchema);
