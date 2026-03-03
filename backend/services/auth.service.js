const supabase = require("../config/supabase");
const User = require("../models/user.model");

/**
 * Register — Sign Up
 * Flow:
 * 1. Create user in Supabase Auth (stores email + hashed password)
 * 2. Save user in our users table (id + email only, NO password)
 * 3. Return session token
 */
const register = async ({ email, password }) => {
    // Step 1: Create in Supabase Auth → appears in Authentication tab
    const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // skip email verification
        });

    if (authError) {
        const err = new Error(authError.message);
        err.statusCode = 409;
        throw err;
    }

    // Step 2: Save in our users table — NO password
    await User.create({
        id: authData.user.id,   // same UUID from Supabase Auth
        email: authData.user.email,
    });

    // Step 3: Sign in to get session token
    const { data: sessionData, error: sessionError } =
        await supabase.auth.signInWithPassword({ email, password });

    if (sessionError) {
        const err = new Error(sessionError.message);
        err.statusCode = 401;
        throw err;
    }

    return {
        token: sessionData.session.access_token,
        user: { id: authData.user.id, email: authData.user.email },
    };
};

/**
 * Login — Sign In
 * Flow:
 * 1. Verify credentials via Supabase Auth
 * 2. Return session token + user id
 */
const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    return {
        token: data.session.access_token,
        user: { id: data.user.id, email: data.user.email },
    };
};

module.exports = { register, login };