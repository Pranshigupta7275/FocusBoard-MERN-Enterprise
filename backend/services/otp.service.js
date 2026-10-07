import Otp from "../models/Otp.js";
import { sendOtpEmail } from "./email.service.js";
import { ApiError } from "../utils/ApiError.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createAndSaveOtp = async (email) => {
  // Delete any existing OTPs for this email to prevent accumulation
  await Otp.deleteMany({ email: email.toLowerCase() });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const otpRecord = await Otp.create({
    email: email.toLowerCase(),
    otp,
    expiresAt,
    used: false,
  });

  await sendOtpEmail(email, otp);

  return otp;
};

const verifyAndConsumeOtp = async (email, otp) => {
  const normalizedEmail = email.toLowerCase();

  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    otp,
    used: false,
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid or already used OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new ApiError(400, "OTP has expired");
  }

  // Mark as used (one-time use)
  otpRecord.used = true;
  await otpRecord.save();

  return { success: true, email: normalizedEmail };
};

export { createAndSaveOtp, verifyAndConsumeOtp };