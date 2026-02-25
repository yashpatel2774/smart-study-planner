const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

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