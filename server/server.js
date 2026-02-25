const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

/* -------------------- APP INIT -------------------- */

const app = express();

/* -------------------- CORS CONFIG (VERY IMPORTANT) -------------------- */

/* -------------------- CORS CONFIG -------------------- */

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://smart-studies-planner.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// EXPRESS 5 FIX (IMPORTANT)
app.options(/.*/, cors(corsOptions));

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json()); // parse JSON body

/* -------------------- ROUTES IMPORT -------------------- */

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

/* -------------------- HEALTH CHECK -------------------- */
// Very useful for Render to keep server alive
app.get("/", (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    message: "Smart Study Planner API Running 🚀",
  });
});

/* -------------------- API ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

/* -------------------- DATABASE CONNECTION -------------------- */

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });

/* -------------------- CRON JOB -------------------- */
// loads reminder background job
require("./cron/reminderJob");

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err.message);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err.message);
});