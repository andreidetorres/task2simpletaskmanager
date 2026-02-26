/**
 * Global error handler — registered LAST in server.js.
 * Catches every error thrown or passed via next(err) from any route or middleware.
 * Handles Sequelize-specific errors and general app errors.
 */
const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);

    // Duplicate entry — e.g. email already registered
    if (err.name === "SequelizeUniqueConstraintError") {
        const field = err.errors[0]?.path || "field";
        return res.status(409).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        });
    }

    // Model validation failed — e.g. empty title, invalid status enum
    if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", "),
        });
    }

    // Can't reach MySQL server
    if (err.name === "SequelizeConnectionError") {
        return res.status(500).json({
            success: false,
            message: "Database connection failed. Please try again.",
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }

    // Fallback
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong. Please try again.",
    });
};

module.exports = errorMiddleware;