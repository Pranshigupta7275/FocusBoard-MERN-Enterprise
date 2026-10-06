import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; 

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

config();

const app = express();

// --- CORS CONFIGURATION (MUST BE FIRST) ---
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://focusboard-mern.onrender.com" // <-- Your live frontend added here
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // <-- Added to fix preflight error
}));

app.use(json());
app.use(cookieParser());

connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send(" FocusBoard API is running!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});