// controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerUserService,
  loginUserService,
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
} = require("../services/authService");
const messages = require("../config/messages");

// Helper function to standardize the response format
const sendResponse = (res, data, status, success, message) => {
  return res.status(status).json({
    data,
    status,
    success,
    message,
  });
};

// Register a user
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await registerUserService(email, password);
    sendResponse(res, null, 201, true, messages.USER_REGISTERED);
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 500, false, messages.SERVER_ERROR);
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginUserService(email, password);
    sendResponse(res, { token }, 200, true, "Login successful");
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 400, false, messages.INVALID_CREDENTIALS);
  }
};

// Forgot Password (send OTP)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await forgotPasswordService(email);
    sendResponse(res, null, 200, true, messages.OTP_SENT);
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 500, false, messages.SERVER_ERROR);
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    await verifyOtpService(email, otp);
    sendResponse(res, null, 200, true, messages.OTP_VERIFIED);
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 400, false, error.message || messages.OTP_INVALID);
  }
};

// Reset Password after OTP Verification
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
console.log(email)
  try {
    // Reset the password
    await resetPasswordService(email, newPassword);

    sendResponse(res, null, 200, true, "Password reset successfully.");
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 500, false, error.message || messages.SERVER_ERROR);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
