// import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  // TODO: Implement actual email sending logic here
  // const transporter = nodemailer.createTransport({...})
  // await transporter.sendMail({...})
  
  console.log(`[Email Service Mock] OTP for ${email}: ${otp}`);
  return true;
};