import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateToken } from "./jwt.service.js";
import { createAndSaveOtp, verifyAndConsumeOtp } from "./otp.service.js";
import { sendOtpEmail } from "./email.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

/* -------------------------------------------------------------------------- */
/* Registration                                                                */
/* -------------------------------------------------------------------------- */

export const createUser = async (data) => {
  const { name, username, email, password } = data;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  if (username.length < 3 || username.length > 50) {
    throw new ApiError(400, "Username must be between 3 and 50 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // IMPORTANT: Do NOT pre-hash the password here.
  // The User model's pre("save") hook (User.js) hashes the password exactly once.
  // Double-hashing (service + model hook) would make bcrypt.compare() fail on login.
  const user = await User.create({
    name: name ? name.trim() : undefined,
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password,  // plaintext — model hook will hash it
    role: "user",
  });

  return user;
};

/* -------------------------------------------------------------------------- */
/* Login                                                                       */
/* -------------------------------------------------------------------------- */

export const authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
};

/* -------------------------------------------------------------------------- */
/* Profile                                                                     */
/* -------------------------------------------------------------------------- */

export const getUserById = async (id) => {
  if (!id) {
    throw new ApiError(401, "User not found");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/* -------------------------------------------------------------------------- */
/* Passwordless / OTP                                                          */
/* -------------------------------------------------------------------------- */

export const requestOtpService = async (email) => {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const userExists = await User.exists({ email: email.toLowerCase() });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const otp = await createAndSaveOtp(email);

  return new ApiResponse(200, null, "OTP sent successfully");
};

export const verifyOtpService = async (email, otp) => {
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  await verifyAndConsumeOtp(email, otp);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = generateToken(user._id, user.role);
  const formattedUser = formatUserResponse(user);

  return new ApiResponse(
    200,
    { user: formattedUser, token },
    "OTP verified successfully"
  );
};

/* -------------------------------------------------------------------------- */
/* Logout                                                                      */
/* -------------------------------------------------------------------------- */

export const logoutService = async () => {
  return new ApiResponse(200, null, "Logged out successfully");
};

/* -------------------------------------------------------------------------- */
/* Legacy compatibility exports (used by existing authController)             */
/* -------------------------------------------------------------------------- */

export const passwordlessLogin = verifyOtpService;
export const findUserById = getUserById;
export const requestOtp = requestOtpService;
export const verifyOtp = verifyOtpService;
export const logoutUser = logoutService;