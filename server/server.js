const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================================================
   HARD CORS FIX (handles browser preflight before anything)
   ========================================================= */

const FRONTEND_URL = "https://smart-studies-planner.netlify.app";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // VERY IMPORTANT → handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

/* =========================================================
   NORMAL CORS (for express routing)
   ========================================================= */

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   HEALTH CHECK ROUTE (Render uses this)
   ========================================================= */

app.get("/", (req, res) => {
  res.status(200).send("Smart Study Planner API Running 🚀");
});

/* =========================================================
   ROUTES
   ========================================================= */
/* ================= PRE-FLIGHT (CORS OPTIONS) HANDLER ================= */

app.options("/api/*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://smart-studies-planner.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  return res.sendStatus(200);
});

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================================================
   START SERVER FIRST (IMPORTANT FOR RENDER)
   ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================================================
   DATABASE CONNECTION (Mongoose v8 compatible)
   ========================================================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

/* =========================================================
   CRON JOB
   ========================================================= */

require("./cron/reminderJob");

/* =========================================================
   ERROR SAFETY (prevents crashes)
   ========================================================= */

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});