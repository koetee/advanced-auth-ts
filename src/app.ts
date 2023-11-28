import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import limiter from "./middleware/rateLimiter";
import corsMiddleware from "./middleware/cors";
import helmetMiddleware from "./middleware/helmet";

import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log("MongoDB connection successful.");
  })
  .catch((err) => {
    console.log(`MongoDB connection error:${err}`);
  });

app.use(morgan("combined"));

app.use(limiter);
app.use(corsMiddleware);
app.use(helmetMiddleware);

app.use(cookieParser());
app.use(express.json());

// rout
app.use("/auth", authRoutes);
app.use("/", protectedRoutes);

app.listen(PORT, () => {
  console.log(`Auth-Server is running on port ${PORT}`);
});
