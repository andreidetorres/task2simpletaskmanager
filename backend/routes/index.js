const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const taskRoutes = require("./task.routes");
const userRoutes = require("./user.routes");

router.use("/auth", authRoutes);  // /api/auth/register  /api/auth/login  /api/auth/logout
router.use("/tasks", taskRoutes);  // /api/tasks  /api/tasks/:id
router.use("/users", userRoutes);  // /api/users/me

module.exports = router;