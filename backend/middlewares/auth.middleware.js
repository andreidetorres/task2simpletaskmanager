const supabase = require("../config/supabase");

/**
 * Verifies the Supabase session token instead of our custom JWT
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "You must be logged in to access this resource",
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token with Supabase Auth
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // Attach user to request
        req.user = { id: data.user.id, email: data.user.email };
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;