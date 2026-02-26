const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// POST /api/auth/register  →  Sign Up screen
router.post("/register", authController.register);

// POST /api/auth/login     →  Sign In screen
router.post("/login", authController.login);

// POST /api/auth/logout    →  Sign out button (protected)
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;