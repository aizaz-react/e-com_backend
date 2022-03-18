const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const { User } = require("../models/user");
const auth = require("../middleware/tokenAuth");

router.post("/", auth, async (req, res) => {
  let { _id } = req.user;
  if (!_id) return res.status(404).send("Invalid token.");
  let { isSeller } = await User.findById(_id);
  if (isSeller !== "Seller") return res.status(401).send("Access denied, Apply for seller role.");
  let { body } = req;
  const newProduct = new Product({ ...body, sellerId: _id });
  await newProduct.save();
  res.send(newProduct);
});

router.get("/", async (req, res) => {
  try {
    let products = await Product.find({});
    if (products.length === 0) return res.status(404).send("No product found.");
    res.send(products);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let product = await Product.findById(id);
    res.send(product);
  } catch (error) {
    res.status(404).send("No product found related to this " + id);
  }
});

router.patch("/:id", auth, async (req, res) => {
  let { _id } = req.user;
  let { id } = req.params;
  try {
    let product = await Product.findById(id);
    if (`${product.sellerId}` !== `${_id}`) return res.status(404).send("No product found related to this seller.");
    await Product.findByIdAndUpdate(id, req.body);
    res.send("Product updated successfully");
  } catch (error) {
    res.status(404).send("No product found");
  }
});

router.get("/sellerProduct/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let products = await Product.find({ sellerId: id });
    res.send(products);
  } catch (error) {
    res.status(404).send("No product found related to this seller");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully.");
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

module.exports = router;
