const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

const dashboardController = require("../controllers/dashboardController.js");
const productController = require("../controllers/productController.js");
const categoryController = require("../controllers/categoryController.js");
const profileController = require("../controllers/profileController.js");

const verifyToken = require("../middleware/verifyToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Dashboard Route (Protected)
router.get("/dashboard", verifyToken, dashboardController.getDashboardStats);

// Product Routes (Protected)
router.get("/products", verifyToken, productController.getProducts);
router.post("/products", verifyToken, productController.addProduct);
router.put("/products/:id", verifyToken, productController.updateProduct);
router.delete("/products/:id", verifyToken, productController.deleteProduct);

// Category Routes (Protected)
router.post("/categories", verifyToken, categoryController.addCategory);
router.put("/categories/:id", verifyToken, categoryController.updateCategory);
router.delete(
  "/categories/:id",
  verifyToken,
  categoryController.deleteCategory
);

// Profile Routes (Protected)
router.get("/profile", verifyToken, profileController.getProfile);
router.put("/profile", verifyToken, profileController.updateProfile);

module.exports = router;
