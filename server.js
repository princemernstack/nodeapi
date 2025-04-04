const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const logRequest = require("./middleware/loggerMiddleware");
const pool = require("./config/db");

dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Use the logging middleware for all requests
app.use(logRequest);

// Register routes under the '/api/auth' path
app.use("/api", authRoutes);

// Starting the server only if DB is connected
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
