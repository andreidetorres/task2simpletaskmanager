const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// users table: id + email ONLY
// Password is stored in Supabase Auth — NOT here
const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            // No defaultValue — UUID comes from Supabase Auth
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: "Please enter a valid email address" },
            },
        },
    },
    {
        tableName: "users",
        timestamps: true,
    }
);

module.exports = User;