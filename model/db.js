const mongoose = require("mongoose");

const uri = process.env.MONGO_DB_URI;

mongoose.connect(uri);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});