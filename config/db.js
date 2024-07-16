const mongoose = require('mongoose');
const uri = process.env.MONGO_URL;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

module.exports = connectDB;