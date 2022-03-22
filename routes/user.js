const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middleware/tokenAuth");
const upload = require("../middleware/imageUpload");

router.post("/", upload.single("profilePic"), async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already exists.");
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profilePic: req.file.path,
    isSeller: req.body.isSeller,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  res.send(newUser);
  await newUser.save();
  const token = newUser.generateAuthToken(newUser);
  res.header("x-auth-token", token).send(_.pick(newUser, ["_id", "name", "email"]));
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

router.patch("/:id", upload.single("profilePic"), async (req, res) => {
  let { body } = req;
  delete body["isSeller"];
  try {
    let user = await User.findByIdAndUpdate(req.params.id, body);
    res.send({ message: "User updated successfully.", User: user });
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    res.send({ message: "User deleted successfully.", User: user });
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

router.patch("/userAction/:id", auth, async (req, res) => {
  console.log(res.user);
});

module.exports = router;
