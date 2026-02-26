const { Sequelize } = require("sequelize");
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, NODE_ENV } = require("./env");

// Shared Sequelize instance — imported by all models
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: NODE_ENV === "development" ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

/**
 * Connects to MySQL and auto-syncs all models.
 * sync({ alter: true }) creates tables if they don't exist
 * and updates columns to match model changes without dropping data.
 */
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ MySQL Connected successfully");

        await sequelize.sync({ alter: true });
        console.log("✅ All tables synced");
    } catch (error) {
        console.error(`❌ MySQL connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };