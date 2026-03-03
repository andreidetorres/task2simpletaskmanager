const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const supabase = require("../config/supabase");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

const generateToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Register — Sign Up screen
 * 1. Creates user in Supabase Auth (visible in Authentication tab)
 * 2. Saves user in users table using the same UUID from Supabase Auth
 */
const register = async ({ email, password }) => {
    // Step 1: Create in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // skips email verification
    });

    if (error) {
        const err = new Error(error.message);
        err.statusCode = error.status || 400;
        throw err;
    }

    const supabaseUserId = data.user.id;

    // Step 2: Save to your users table using Supabase Auth UUID
    const existing = await User.findOne({ where: { email } });
    if (!existing) {
        await User.create({
            id: supabaseUserId, // use Supabase Auth UUID
            email,
            password,           // will be hashed by beforeCreate hook
        });
    }

    const token = generateToken(supabaseUserId);
    return { token, user: { id: supabaseUserId, email } };
};

/**
 * Login — Sign In screen
 * 1. Verifies credentials via Supabase Auth
 * 2. Fetches user from your users table for app data
 */
const login = async ({ email, password }) => {
    // Step 1: Verify via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    // Step 2: Get user from your users table
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const err = new Error("User not found in database");
        err.statusCode = 404;
        throw err;
    }

    const token = generateToken(user.id);
    return { token, user: { id: user.id, email: user.email } };
};

module.exports = { register, login };