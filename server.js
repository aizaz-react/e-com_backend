const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./models/db");
const app = express();
const userRoutes = require("./routes/user");
const ProductRoutes = require("./routes/products");
const login = require("./routes/login");

app.use(bodyParser.json({ extended: true }));
app.use(cors("http://localhost:3000"));
app.use("/uploads", express.static("uploads"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/user", userRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/login", login);

app.listen(3000, function () {
  console.log("listening on 3000");
});
