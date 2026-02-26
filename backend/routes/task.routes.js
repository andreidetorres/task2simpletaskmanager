const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All task routes require a valid JWT
router.use(authMiddleware);

// GET  /api/tasks     →  load task list (All / Active / Done tabs + search bar)
// POST /api/tasks     →  "+ Add" button
router
    .route("/")
    .get(taskController.getTasks)
    .post(taskController.createTask);

// PATCH  /api/tasks/:id  →  toggle checkbox (circle ↔ orange check)
// DELETE /api/tasks/:id  →  delete a task
router
    .route("/:id")
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;