const taskService = require("../services/task.service");

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET /api/tasks
 * Triggered by: page load, filter tab clicks, search bar input
 *
 * Query params:
 *   ?status=active   → Active tab  (empty circle tasks only)
 *   ?status=done     → Done tab    (checked tasks only)
 *   ?status=all      → All tab     (default — everything)
 *   ?search=keyword  → Search bar  (filters by title)
 *
 * Returns: { tasks: [...], remainingCount: 4 }
 *   remainingCount powers: "Hi user@email.com · 4 tasks remaining"
 */
const getTasks = asyncHandler(async (req, res) => {
    const { tasks, remainingCount } = await taskService.getAllTasks(req.user.id, req.query);
    res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: { tasks, remainingCount },
    });
});

/**
 * POST /api/tasks
 * Triggered by: "+ Add" button
 * Body: { title }
 * Returns: { task }
 */
const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: { task },
    });
});

/**
 * PATCH /api/tasks/:id
 * Triggered by: clicking the circle checkbox to toggle done ↔ active
 * Body: { status: "done" } or { status: "active" }
 * Returns: { task }
 */
const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: { task },
    });
});

/**
 * DELETE /api/tasks/:id
 * Triggered by: delete action on a task
 */
const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.user.id, req.params.id);
    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };