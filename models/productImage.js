const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("ProductImages", productImageSchema);
