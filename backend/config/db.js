const { Sequelize } = require("sequelize");
const { DATABASE_URL, NODE_ENV } = require("./env");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Supabase PostgreSQL Connected successfully");

    await sequelize.sync();
    console.log("✅ Models synced");
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };