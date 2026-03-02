const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

// MySQL table: users
// Columns: id, email, password, createdAt, updatedAt
const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: "Please enter a valid email address" },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [6, 255], msg: "Password must be at least 6 characters" },
            },
        },
    },
    {
        tableName: "users",
        timestamps: true,
    }
);

// Hash password before INSERT
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
});

// Hash password before UPDATE (only if changed)
User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 12);
    }
});

// Compare plain-text password against stored hash
User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;