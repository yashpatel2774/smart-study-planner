const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================================================
   CORS (PRODUCTION SAFE)
   ========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://smart-studies-planner.netlify.app",
  "https://smart-studies-planner.netlify.app/", // safety
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS Not Allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Express 5 preflight fix

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   HEALTH CHECK (VERY IMPORTANT FOR RENDER)
   ========================================================= */

app.get("/", (req, res) => {
  res.status(200).send("Smart Study Planner API Running 🚀");
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
   DATABASE CONNECTION (MONGOOSE v8 FIX)
   ========================================================= */

const PORT = process.env.PORT || 5000;

// START SERVER FIRST (IMPORTANT FOR RENDER)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// THEN CONNECT DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });

/* =========================================================
   CRON JOB
   ========================================================= */

require("./cron/reminderJob");

/* =========================================================
   GLOBAL ERROR HANDLERS (PREVENT SERVER CRASH)
   ========================================================= */

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});