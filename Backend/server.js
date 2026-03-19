"use strict";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes = require("./src/routes/authRoutes");
const superAdminRoutes = require("./src/routes/superAdminRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");

// ── App initialisation ────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";


// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. curl, Postman) in non-production
      if (!origin && NODE_ENV !== "production") return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsing & cookie parser ──────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));       // Guard against large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());




/** Global limiter — all routes */
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});



// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.status(200).json({
    success: true,
    message: "Betting Dashboard API is healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/superadmin", superAdminRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// ── 404 + global error handler (must be last) ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("╔══════════════════════════════════════════╗");
      console.log("║      Betting Dashboard API               ║");
      console.log("╠══════════════════════════════════════════╣");
      console.log(`║  🚀  http://localhost:${PORT}            ║`);
      console.log(`║  🌍  ${NODE_ENV.padEnd(36)}║`);
      console.log("╚══════════════════════════════════════════╝");
      console.log("");
    });
  } catch (err) {
    console.error("❌  Server failed to start:", err.message);
    process.exit(1);
  }
};

start();

module.exports = app; 
