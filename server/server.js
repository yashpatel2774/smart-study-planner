const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://smartstudyplanner.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// VERY IMPORTANT (this fixes login/register)
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Study Planner API Running");
});

app.use("/api/auth", authRoutes); // AUTH ROUTES
app.use("/api/tasks", taskRoutes); // TASK ROUTES
app.use("/api/notifications", notificationRoutes); // NOTIFICATION ROUTES

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log(err));
require("./cron/reminderJob");