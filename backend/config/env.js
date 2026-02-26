const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// MySQL
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || "taskmanager";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

if (!process.env.JWT_SECRET && NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production!");
}

module.exports = {
    PORT, NODE_ENV, CLIENT_URL,
    JWT_SECRET, JWT_EXPIRES_IN,
    DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
};