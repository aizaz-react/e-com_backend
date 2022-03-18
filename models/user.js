const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
  isSeller: {
    type: String,
    enum: ["Buyer", "Seller", "Admin"],
    default: "Buyer",
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = (user) => {
  let { name, email, firstName, lastName, isSeller, _id } = user;
  const token = jwt.sign({ name, email, firstName, lastName, isSeller, _id }, "jsonwebtoken");
  return token;
};

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    isSeller: Joi.string().valid("Buyer", "Seller", "Admin").required().default("Buyer"),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);
exports.User = User;
exports.validate = validateUser;
