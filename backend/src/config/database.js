const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectDb;
