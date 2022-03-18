const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  let validatePassword = await bcrypt.compare(req.body.password, user.password);
  if (!validatePassword) return res.status(400).send("Incorrect password");
  const token = user.generateAuthToken(user);
  res.send({ token });
});

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

module.exports = router;
