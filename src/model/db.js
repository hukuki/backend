const mongoose = require("mongoose");

const uri = process.env.MONGO_DB_URI || "mongodb://mongo:27017/main";

mongoose.connect(uri);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

connection.once("error", () => {
  console.log("MongoDB database connection failed");
});
