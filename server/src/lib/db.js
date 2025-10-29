import mongoose from "mongoose";

const connDB = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDb connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Database error", error);
    process.exit(1);
  }
};

export default connDB;
