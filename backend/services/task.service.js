const { Op } = require("sequelize");
const Task = require("../models/task.model");

const getAllTasks = async (userId, { status, search } = {}) => {
    const where = { userId };

    if (status && status !== "all") {
        where.status = status;
    }

    if (search) {
        where.title = { [Op.like]: `%${search}%` };
    }

    const tasks = await Task.findAll({
        where,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "title", "status", "deadline", "createdAt", "updatedAt"], // ← added deadline
    });

    const remainingCount = await Task.count({
        where: { userId, status: "active" },
    });

    return { tasks, remainingCount };
};

const createTask = async (userId, { title, deadline }) => {  // ← added deadline
    return Task.create({ title, userId, deadline: deadline || null });
};

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