const mongoose = require("mongoose");

const databaseConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/movies_api");
    console.log("Success to connect MongoDB");
  } catch (error) {
    console.log("Failed to connect MongoDB");
    console.log(error);
  }
};

module.exports = databaseConnection;
