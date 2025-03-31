// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route to send OTP for forgot password
router.post("/forgot-password", forgotPassword);

// Route to verify OTP
router.post("/verify-otp", verifyOtp);

router.post("/reset-password", resetPassword);

module.exports = router;
