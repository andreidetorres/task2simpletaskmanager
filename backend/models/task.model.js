const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user.model");

// MySQL table: tasks
// Columns: id, title, status, userId, createdAt, updatedAt
//
// Maps directly to the UI:
//   title     → "ojt", "cooking", "gym", "basketball"
//   status    → "active" = empty circle | "done" = orange check + strikethrough
//   createdAt → "Feb 25, 2026, 02:57 PM" shown under each task title
//   userId    → foreign key — each task belongs to one user
const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Task title cannot be empty" },
                len: { args: [1, 200], msg: "Title cannot exceed 200 characters" },
            },
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
    },
    {
        tableName: "tasks",
        timestamps: true,
    }
);

// Associations
User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });

module.exports = Task;