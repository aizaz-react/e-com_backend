const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://aizaz:admin@cluster0.ex7jo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

mongoose.connection
  .once("open", () => console.log("Connected to Mongodb"))
  .on("error", () => console.log("Error with the data base"));
