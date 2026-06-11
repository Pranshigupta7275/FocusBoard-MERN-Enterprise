import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../services/jwt.service.js";
import { sendOtpEmail } from "../services/email.service.js";
import { createAndSaveOtp, verifyAndConsumeOtp } from "../services/otp.service.js";
import { 
  createUser, 
  authenticateUser, 
  getUserById, 
  formatUserResponse 
} from "../services/auth.service.js";
import User from "../models/User.js";

/* -------------------------------------------------------------------------- */
/* Cookie Helper                                                              */
/* -------------------------------------------------------------------------- */

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Best practice: true in production, false locally
  sameSite: "lax",      
  maxAge: 60 * 60 * 1000, 
};

/* -------------------------------------------------------------------------- */
/* Controllers                                                                */
/* -------------------------------------------------------------------------- */

export const registerUser = asyncHandler(async (req, res) => {
  // SECURITY CHECK: We explicitly extract ONLY these fields. 
  // If a hacker sends "role: admin" in req.body, it is completely ignored here.
  // We also added 'name' to sync with your updated User schema.
  const { name, username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  // Pass the extracted safe data to your service
  const user = await createUser({ name, username, email, password });
  const token = generateToken(user._id, user.role);
  const formattedUser = formatUserResponse(user);

  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(201, { user: formattedUser, token }, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await authenticateUser(email, password);
  const token = generateToken(user._id, user.role);
  const formattedUser = formatUserResponse(user);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, { user: formattedUser, token }, "Login successful"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  // Assumes you have an auth middleware that sets req.user
  const user = await getUserById(req.user.id);
  const formattedUser = formatUserResponse(user);

  return res
    .status(200)
    .json(new ApiResponse(200, { user: formattedUser }, "Profile fetched successfully"));
});

export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const userExists = await User.exists({ email: email.toLowerCase() });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const otp = await createAndSaveOtp(email);
  await sendOtpEmail(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully"));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  await verifyAndConsumeOtp(email, otp);

  // If OTP is verified, grab the user to issue a token
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = generateToken(user._id, user.role);
  const formattedUser = formatUserResponse(user);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, { user: formattedUser, token }, "OTP verified successfully"));
});