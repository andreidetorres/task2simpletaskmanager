require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");
const corsOptions = require("./config/cors");
const routes = require("./routes/index");
const errorMiddleware = require("./middlewares/error.middleware");


const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () =>
        console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`)
    );
    next();
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── Health Check ───────────────────────────────────────────────────────────
app.get("/", (req, res) =>
    res.json({ message: "Task Manager API is running ✅" })
);

// ── Global Error Handler (must be last) ───────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ───────────────────────────────────────────────────────────
connectDB().then(() => {
    app.listen(PORT, () =>
        console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`)
    );
});