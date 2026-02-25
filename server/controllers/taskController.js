const Task = require("../models/Task");

// ADD TASK
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user,
      title: req.body.title,
      dueDate: req.body.dueDate
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE COMPLETE
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};