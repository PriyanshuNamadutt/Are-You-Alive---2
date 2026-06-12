// ── MUST be the very first line ──────────────────────────────────────
// Polyfill crypto.webcrypto for Node < 19 (required by Mongoose 7+)
if (!globalThis.crypto) {
  globalThis.crypto = require("crypto").webcrypto;
}

require("dotenv").config();

const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/Database");
const logger    = require("./utils/logger");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Routes
const healthRoutes  = require("./routes/health");
const searchRoutes  = require("./routes/search");
const productRoutes = require("./routes/products");
const storesRoutes  = require("./routes/stores");
const alertRoutes   = require("./routes/alerts");
const authRoutes    = require("./routes/auth");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ────────────────────────────────────────────────
connectDB();

// ── Security & Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("combined", { stream: { write: m => logger.info(m.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiters ─────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, max: 300,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, error: "Too many requests. Try again in 15 minutes." },
}));

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, max: 30,
  message: { success: false, error: "Search rate limit hit. Max 30/minute." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  message: { success: false, error: "Too many auth attempts. Try again in 15 minutes." },
});

// ── Routes ────────────────────────────────────────────────────────────
app.use("/api/health",   healthRoutes);
app.use("/api/auth",     authLimiter,   authRoutes);
app.use("/api/search",   searchLimiter, searchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stores",   storesRoutes);
app.use("/api/alerts",   alertRoutes);

// ── Error Handling ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 DealPlus API    → http://localhost:${PORT}`);
  logger.info(`🌍 Environment     → ${process.env.NODE_ENV || "development"}`);
  logger.info(`🗄️  MongoDB         → ${process.env.MONGODB_URI ? "configured" : "not set (mock mode)"}`);
});

module.exports = app;