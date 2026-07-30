import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./logger/logger.js";

connectDB();

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});
