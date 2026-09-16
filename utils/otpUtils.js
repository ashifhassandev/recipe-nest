const crypto = require("crypto");
const OTP = require("../models/otpModel");
const transporter = require("../config/emailConfig");

// Generate a 6-digit random OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Store the OTP in the database with an expiration time of 1 minute
const storeOtp = async (email, otp) => {
  try {
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });
  } catch (error) {
    console.error("Error storing the OTP:", error);
    throw new Error("Failed to store OTP.");
  }
};

// Send the OTP to the user's email
const sendOtp = async (email, otp) => {
  const mailOptions = {
    from: process.env.SEND_OTP_EMAIL,
    to: email,
    subject: "OTP Code For RecipeNest Registration",
    html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 2 minutes. Please do not share this code with anyone.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Error sending the OTP:", error);
    throw new Error("Failed to send OTP.");
  }
};

// Verify the OTP entered by the user
const verifyOtp = async (email, otp) => {
  try {
    const latestOtp = await OTP.findOne({ email })
      .select("email otp expiresAt")
      .sort({ expiresAt: -1 });

    if (!latestOtp) {
      return { isVerified: false, reason: "notFound" };
    }

    const isExpired = new Date() > latestOtp.expiresAt;
    if (isExpired) {
      await OTP.deleteOne({ email: latestOtp.email, otp: latestOtp.otp });
      return { isVerified: false, reason: "expired" };
    }

    const isMatch = otp === latestOtp.otp;
    if (isMatch) {
      await OTP.deleteMany({ email });
      return { isVerified: true };
    } else {
      return { isVerified: false, reason: "invalid" };
    }
  } catch (error) {
    console.error("Failed to verify the OTP:", error);
    throw new Error("Failed to verify the OTP.");
  }
};

// Cleanup expired OTPs from the database
const cleanupExpiredOtps = async () => {
  const now = new Date();
  try {
    await OTP.deleteMany({ expiresAt: { $lte: now } });
    console.log("Expired OTP's cleaned up successfully.");
  } catch (error) {
    console.error("Error cleaning up expired OTP's:", error);
  }
};

module.exports = {
  generateOtp,
  storeOtp,
  sendOtp,
  verifyOtp,
  cleanupExpiredOtps,
};