import nodemailer from "nodemailer";

const isSmtpConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!isSmtpConfigured()) {
    console.warn(
      " SMTP environment variables are not fully configured. Email sending will be skipped (development mode)."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendOtpEmail = async (email, otp) => {
  const transport = getTransporter();

  if (!transport) {
    // Development/mock mode: OTP is generated and stored, but not emailed.
    // This keeps the OTP flow functional without requiring real SMTP credentials.
    console.warn(`[DEV] OTP email requested for ${email} (SMTP not configured; OTP generated but not sent)`);
    return { success: true, dev: true };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Focous Board " <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your FocusBoard OTP",
    text: `Your OTP is: ${otp}.\n\nThis OTP expires in 10 minutes.\n\nIf you did not request this OTP, please ignore this email.\n\n— Focous Board `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; margin-bottom: 16px;">Focous Board </h2>
        <p style="color: #555; font-size: 14px; margin-bottom: 16px;">Your OTP</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1a73e8; margin: 16px 0;">${otp}</p>
        <p style="color: #777; font-size: 13px; margin-bottom: 16px;">This OTP expires in 10 minutes.</p>
        <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 12px;">
          If you did not request this OTP, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 8px;">— Focous Board </p>
      </div>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(" Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(" Email send failed:", error?.message);
    throw new Error("Failed to send OTP email");
  }
};

export default { sendOtpEmail };