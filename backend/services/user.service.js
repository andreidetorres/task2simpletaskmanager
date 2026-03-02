const User = require("../models/user.model");

/**
 * Returns a user by ID — used by GET /api/users/me.
 * Powers the header greeting: "Hi andreidetorres@gmail.com · 4 tasks remaining"
 * Password is excluded via attributes.
 */
const getUserById = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: ["id", "email", "createdAt"],
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return { id: user.id, email: user.email, createdAt: user.createdAt };
};

module.exports = { getUserById };