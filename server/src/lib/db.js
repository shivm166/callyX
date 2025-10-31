import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// ✅ Tell dotenv exactly where your .env file is
dotenv.config({ path: path.resolve("server/.env") });

const connDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.log("❌ MONGO_URL is undefined!");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("❌ Database error:", error);
    process.exit(1);
  }
};

export default connDB;
