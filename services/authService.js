const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { sendOtp } = require("./emailService");
const { generateOtp } = require("../utils/otpUtils");

const registerUserService = async (name, username, email, password) => {
  const emailResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (emailResult.rows.length > 0) {
    const error = new Error("Email already exists");
    error.status = 400; 
    throw error;
  }

  const usernameResult = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (usernameResult.rows.length > 0) {
    const error = new Error("Username already exists");
    error.status = 400; 
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)",
    [name, username, email, hashedPassword]
  );
};

const loginUserService = async (email, password) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

const forgotPasswordService = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("Email not found");
  }

  const otp = generateOtp();
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

  await pool.query(
    "UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3",
    [otp, otpExpiry, email]
  );
  await sendOtp(email, otp);
};

const verifyOtpService = async (email, otp) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user || user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const now = new Date();
  if (user.otp_expiry < now) {
    throw new Error("OTP has expired");
  }
};

const resetPasswordService = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
    hashedPassword,
    email,
  ]);
};

module.exports = {
  registerUserService,
  loginUserService,
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
};
