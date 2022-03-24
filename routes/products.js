const express = require("express");
const router = express.Router();

// const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const { User } = require("../models/user");
const auth = require("../middleware/tokenAuth");
const upload = require("../middleware/imageUpload");
const { validate, Product } = require("../models/product");

router.post("/", upload.array("productPic"), auth, async (req, res) => {
  let { body, files } = req;
  let { _id } = req.user;
  if (!_id) return res.status(404).send("Invalid token.");
  let { isSeller } = await User.findById(_id);
  if (isSeller !== "Seller") return res.status(401).send("Access denied, Apply for seller role.");
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const newProduct = new Product({ ...body, sellerId: _id });
    if (files.length === 0) return res.status(400).send("Please Enter Product Images");
    files.map(async (file) => {
      const image = new ProductImage({ name: file.path, productId: newProduct._id });
      await image.save();
    });
    await newProduct.save();
    res.send(newProduct);
  } catch (error) {
    console.log({ error });
  }
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
    let [product, images] = await Promise.all([Product.findById(id), ProductImage.find({ productId: id })]);

    res.send({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      sellerId: product.sellerId,
      images,
    });
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
