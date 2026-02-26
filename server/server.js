const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* ====================== CORS (EXPRESS 5 SAFE) ====================== */

const FRONTEND = "https://smart-studies-planner.netlify.app";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // handle preflight request here (NO WILDCARD ROUTES)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ====================== BODY PARSER ====================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ====================== HEALTH ROUTE ====================== */

app.get("/", (req, res) => {
  res.send("Smart Study Planner API Running 🚀");
});

/* ====================== ROUTES ====================== */

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

/* ====================== SERVER ====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ====================== DATABASE ====================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err.message));

/* ====================== CRON ====================== */

require("./cron/reminderJob");