import Otp from "../models/Otp.js";
import { ApiError } from "../utils/ApiError.js";

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createAndSaveOtp = async (email) => {
  const otp = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await Otp.deleteMany({ email: email.toLowerCase() }); // Clear old OTPs
  await Otp.create({
    email: email.toLowerCase(),
    otp,
    expiresAt,
  });

  return otp;
};

export const verifyAndConsumeOtp = async (email, otpCode) => {
  const otpRecord = await Otp.findOne({ email: email.toLowerCase(), otp: otpCode });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new ApiError(400, "OTP has expired");
  }

  // Consume OTP after successful validation
  await Otp.deleteOne({ _id: otpRecord._id });
  return true;
};