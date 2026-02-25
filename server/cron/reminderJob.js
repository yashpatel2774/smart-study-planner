const cron = require("node-cron");
const Task = require("../models/Task");
const Subscription = require("../models/Subscription");
const webpush = require("../config/pushConfig");

console.log("Reminder Job Loaded");

// 8 PM daily
cron.schedule("0 20 * * *", async () => {
  console.log("Running daily reminder job...");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(tomorrow.setHours(0,0,0,0));
  const end = new Date(tomorrow.setHours(23,59,59,999));

  // get tomorrow tasks
  const tasks = await Task.find({
    dueDate: { $gte: start, $lte: end }
  });

  // group by user
  const userTasks = {};

  tasks.forEach(task => {
    if (!userTasks[task.user]) {
      userTasks[task.user] = [];
    }
    userTasks[task.user].push(task.title);
  });

  // send 1 notification per user
  for (const userId in userTasks) {

    const sub = await Subscription.findOne({ user: userId });
    if (!sub) continue;

    const titles = userTasks[userId];

    const payload = JSON.stringify({
      title: "📚 TSmart Study Planner Reminder",
      body: `You have ${titles.length} task(s) tomorrow`
    });

    try {
      await webpush.sendNotification(sub.subscription, payload);
      console.log("Notification sent to user");
    } catch (err) {
      console.log("Notification failed");
    }
  }
});