const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("../config/db");
const verifyToken = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT * FROM tokens WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP",
      [token]
    );

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ success: false, message: "Token expired or invalid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
