const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* =========================================================
   SINGLE CLEAN CORS HANDLER (EXPRESS 5 + RENDER SAFE)
   ========================================================= */

const FRONTEND = "https://smart-studies-planner.netlify.app";

// Apply CORS only to API routes
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // IMPORTANT: respond to preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   HEALTH CHECK (for Render)
   ========================================================= */

app.get("/", (req, res) => {
  res.send("Smart Study Planner API Running 🚀");
});

/* =========================================================
   ROUTES
   ========================================================= */

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================================================
   START SERVER FIRST
   ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================================================
   DATABASE
   ========================================================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err.message));

/* =========================================================
   CRON JOB
   ========================================================= */

require("./cron/reminderJob");

/* =========================================================
   SAFETY
   ========================================================= */

process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));