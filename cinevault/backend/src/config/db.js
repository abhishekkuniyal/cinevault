import mongoose from "mongoose";
import "dotenv/config";

async function connectDb() {
  try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("db is connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    throw err;
  }
}

export default connectDb;

