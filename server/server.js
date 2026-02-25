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
  "https://smart-studies-planner.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// VERY IMPORTANT: handle preflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

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