const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user.model");

const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "active",
        },
        deadline: {
            type: DataTypes.DATE,   // ← new field
            allowNull: true,
            defaultValue: null,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
    },
    {
        tableName: "tasks",
        timestamps: true,
    }
);

User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });

module.exports = Task;