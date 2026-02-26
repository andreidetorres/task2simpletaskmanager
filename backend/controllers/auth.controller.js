const authService = require("../services/auth.service");

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * POST /api/auth/register
 * Triggered by: Sign Up screen → Sign Up button
 * Body: { username, password }
 * Returns: { token, user: { id, username } }
 */
const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: result,
    });
});

/**
 * POST /api/auth/login
 * Triggered by: Sign In screen → Sign In button
 * Body: { username, password }
 * Returns: { token, user: { id, username } }
 */
const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });
});

/**
 * POST /api/auth/logout
 * Triggered by: Sign out button (top-right corner)
 * JWT is stateless — actual logout is done on the frontend by discarding the token.
 */
const logout = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

module.exports = { register, login, logout };