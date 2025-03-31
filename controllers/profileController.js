const pool = require("../config/db");
const bcrypt = require("bcryptjs");
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, username, email, role, created_at, updated_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Name, username, and email are required",
      });
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const result = await pool.query(
      "UPDATE users SET name = $1, username = $2, email = $3, password = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [name, username, email, hashedPassword, req.user.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
