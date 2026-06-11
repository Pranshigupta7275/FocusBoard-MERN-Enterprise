import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";


export const createUser = async ({ name, username, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({
    name, 
    username,
    email: email.toLowerCase(),
    password,
    role: "user"
  });

  return user;
};

export const authenticateUser = async (email, password) => {
  console.log("\n--- DEBUGGING LOGIN ---");
  console.log("1. React sent email:", email);
  console.log("2. React sent password:", password);

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  
  console.log("3. User found in DB?", user ? "YES" : "NO");
  if (user) {
    console.log("4. DB Password Hash:", user.password);
  }

  if (!user) {
    throw new ApiError(401, "Invalid credentials - User not found");
  }

  if (!user.password) {
    throw new ApiError(401, "This account does not have a password. Please use OTP to login.");
  }

  const isPasswordMatched = await user.matchPassword(password);
  console.log("5. Did passwords match mathematically?", isPasswordMatched ? "YES" : "NO");
  
  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials - Password mismatch");
  }

  console.log("--- LOGIN SUCCESSFUL ---\n");
  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  return user;
};

export const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name, 
  username: user.username,
  email: user.email,
  role: user.role,
});