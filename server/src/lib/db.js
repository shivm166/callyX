import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // ✅ this ensures env vars are loaded here too

const mongodb = process.env.MONGO_URL;
const connDB = async () => {
  try {
    if (!mongodb) {
      console.log("❌ MONGO_URL is undefined!", error);
      process.exit(1);
    }

    const conn = await mongoose.connect(mongodb);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("❌ Database error:", error);
    process.exit(1);
  }
};

export default connDB;
