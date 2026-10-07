import { config } from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

config();

const ADMIN_NAME = process.env.ADMIN_NAME || "FocusBoard Admin";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "focusboard_admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB connected");

    const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      // Update role to admin; password is NOT changed (preserves existing credentials)
      existing.role = "admin";
      existing.name = ADMIN_NAME;
      existing.username = ADMIN_USERNAME;
      await existing.save();
      console.log(" Admin account updated successfully.");
    } else {
      // Pass PLAINTEXT password — the User model's pre("save") hook hashes it exactly once.
      // This is the same mechanism used by normal registration.
      await User.create({
        name: ADMIN_NAME,
        username: ADMIN_USERNAME,
        email: normalizedEmail,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(" Admin account created successfully.");
    }

    console.log(" Email: " + normalizedEmail);
    await mongoose.disconnect();
  } catch (error) {
    console.error(" Failed to create admin account:", error.message);
    process.exit(1);
  }
}

createAdmin();