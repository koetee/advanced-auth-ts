import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
});

mongoose.connect(process.env.MONGODB_URI || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

app.use(morgan("combined"));

app.use(limiter);
app.use(helmet());

app.use(cookieParser());
app.use(express.json());

// rout
app.use("/auth", authRoutes);
app.use("/", protectedRoutes);

app.listen(PORT, () => {
  console.log(`Auth-Server is running on port ${PORT}`);
});
