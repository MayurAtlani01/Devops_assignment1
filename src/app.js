import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(authRoutes);
app.use(codeRoutes);

app.use(errorHandler);

export default app;
