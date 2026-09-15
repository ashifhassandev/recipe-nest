const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for storing OTP's
const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /\d{6}/.test(value),
      message: "OTP must be a 6-digit number",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;