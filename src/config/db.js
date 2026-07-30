import mongoose from "mongoose";
import logger from "../logger/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
