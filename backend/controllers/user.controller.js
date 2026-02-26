const userService = require("../services/user.service");

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET /api/users/me
 * Triggered by: frontend on page load to get the logged-in user's username
 * Powers the greeting: "Hi username · 4 tasks remaining"
 */
const getMe = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({
        success: true,
        message: "Profile fetched",
        data: { user },
    });
});

module.exports = { getMe };