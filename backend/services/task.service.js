const { Op } = require("sequelize");
const Task = require("../models/task.model");

/**
 * Get all tasks for the logged-in user.
 *
 * Supports all three filter tabs + search bar from the UI:
 *   All tab    → no status filter
 *   Active tab → completed = false  (empty circle)
 *   Done tab   → completed = true    (orange check + strikethrough)
 *   Search bar → SQL LIKE %keyword% on title
 *
 * Also returns remainingCount → "Hi username · 4 tasks remaining"
 */
const getAllTasks = async (userId, { status, search } = {}) => {
    const where = { userId };

    if (status && status !== "all") {
        where.completed = status === "done";
    }

    if (search) {
        where.title = { [Op.like]: `%${search}%` };
    }

    const tasks = await Task.findAll({
        where,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "title", "completed", "createdAt", "updatedAt"],
    });

    const remainingCount = await Task.count({
        where: { userId, completed: false },
    });

    return { tasks, remainingCount };
};

/**
 * Create a new task — triggered by the "+ Add" button.
 * Always starts as not completed (empty circle).
 */
const createTask = async (userId, { title }) => {
    return Task.create({ title, userId });
};

/**
 * Update a task — triggered by:
 *   1. Clicking the checkbox → toggle completed
 *   2. Editing the title (future use)
 *
 * Ownership enforced: users can only update their own tasks.
 */
const updateTask = async (userId, taskId, updates) => {
    const task = await Task.findOne({ where: { id: taskId, userId } });

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    await task.update(updates);
    return task;
};

/**
 * Delete a task.
 * Ownership enforced: users can only delete their own tasks.
 */
const deleteTask = async (userId, taskId) => {
    const task = await Task.findOne({ where: { id: taskId, userId } });

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    await task.destroy();
    return task;
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };