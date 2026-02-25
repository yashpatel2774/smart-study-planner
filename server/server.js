const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* -------------------- FINAL WORKING CORS -------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://smart-studies-planner.netlify.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // ⭐ THIS answers the browser preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ------------------------------------------------------------ */

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