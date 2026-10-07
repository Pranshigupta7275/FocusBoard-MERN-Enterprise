import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../services/jwt.service.js";
import {
  createUser,
  authenticateUser,
  getUserById,
  formatUserResponse,
  requestOtpService,
  verifyOtpService,
  logoutService,
} from "../services/auth.service.js";

/* -------------------------------------------------------------------------- */
/* Cookie Helper                                                              */
/* -------------------------------------------------------------------------- */

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 60 * 60 * 1000,
};

/* -------------------------------------------------------------------------- */
/* Controllers                                                                */
/* -------------------------------------------------------------------------- */

export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

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
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
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

  const response = await requestOtpService(email);
  return res.status(response.statusCode).json(response);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const response = await verifyOtpService(email, otp);
  return res
    .status(response.statusCode)
    .cookie("token", response.data.token, cookieOptions)
    .json(response);
});