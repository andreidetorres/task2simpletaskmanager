const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All user routes require a valid JWT
router.use(authMiddleware);

// GET /api/users/me  →  returns { id, email } for the header greeting
router.get("/me", userController.getMe);

module.exports = router;