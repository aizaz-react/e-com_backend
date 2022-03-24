const mongoose = require("mongoose");
const Joi = require("joi");

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

const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(1028).required(),
    price: Joi.number().required(),
  });
  return schema.validate(product);
};

const Product = mongoose.model("Product", productSchema);
exports.Product = Product;
exports.validate = validateProduct;
