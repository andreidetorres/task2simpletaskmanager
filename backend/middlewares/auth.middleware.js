const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const User = require("../models/user.model");

/**
 * Protects routes by verifying the JWT in the Authorization header.
 * Attaches the authenticated user to req.user for all downstream controllers.
 *
 * Frontend sends every protected request as:
 *   Authorization: Bearer <token>
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
        const decoded = jwt.verify(token, JWT_SECRET);

        // findByPk = Sequelize's "find by primary key" (replaces Mongoose's findById)
        // attributes: never expose the password field downstream
        const user = await User.findByPk(decoded.id, {
            attributes: ["id", "username", "createdAt"],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You must be logged in to access this resource",
            });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;