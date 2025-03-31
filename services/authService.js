// services/authService.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { sendOtp } = require('./emailService');
const { generateOtp } = require('../utils/otpUtils');

// Register a user
const registerUserService = async (email, password) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length > 0) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
};

// Login a user
const loginUserService = async (email, password) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Forgot Password (send OTP)
const forgotPasswordService = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('Email not found');
  }

  const otp = generateOtp();
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

  await pool.query('UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3', [otp, otpExpiry, email]);
  await sendOtp(email, otp);
};

// Verify OTP
const verifyOtpService = async (email, otp) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  const now = new Date();
  if (user.otp_expiry < now) {
    throw new Error('OTP has expired');
  }
};

// Reset the user's password after verifying the OTP
const resetPasswordService = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the password in the database
  await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
};


module.exports = { registerUserService, loginUserService, forgotPasswordService, verifyOtpService, resetPasswordService };
