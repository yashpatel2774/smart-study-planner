const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* -------------------- CORS CONFIG (PRODUCTION SAFE) -------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://smart-studies-planner.netlify.app"
];

const corsOptions = {
  origin: function (origin, callback) {

    // allow mobile apps, postman etc
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// MUST be before routes
app.use(cors(corsOptions));

// THIS IS THE REAL PRE-FLIGHT FIX
app.options("*", cors(corsOptions));

/* ---------------------------------------------------------------------- */

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Study Planner API Running");
});

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

/* -------------------- DATABASE -------------------- */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log(err));

require("./cron/reminderJob");