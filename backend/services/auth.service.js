const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

// Creates a signed JWT with the user's ID as payload
const generateToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Register — Sign Up screen
 * Creates a new user. Throws 409 if email already exists.
 */
const register = async ({ email, password }) => {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        const error = new Error("An account with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const user = await User.create({ email, password });
    const token = generateToken(user.id);

    return { token, user: { id: user.id, email: user.email } };
};

/**
 * Login — Sign In screen
 * Verifies credentials and returns a JWT. Throws 401 if invalid.
 */
const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user.id);

    return { token, user: { id: user.id, email: user.email } };
};

module.exports = { register, login };