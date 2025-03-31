const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerUserService,
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
} = require("../services/authService");
const messages = require("../config/messages");
const pool = require("../config/db");
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
  const { name, username, email, password } = req.body;

  try {
    await registerUserService(name, username, email, password);
    sendResponse(res, null, 201, true, messages.USER_REGISTERED);
  } catch (error) {
    console.error(error);

    const statusCode = error.status || 500;
    const errorMessage = error.message || messages.SERVER_ERROR;

    sendResponse(res, null, statusCode, false, errorMessage);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query(
      "INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
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

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
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
