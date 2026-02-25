import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const getPending = () => JSON.parse(localStorage.getItem("pendingActions")) || [];
const setPending = (data) => localStorage.setItem("pendingActions", JSON.stringify(data));

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
  const local = localStorage.getItem("tasks");
  if (local) {
    setTasks(JSON.parse(local));
  }
}, []);
  // ---------------- FETCH TASKS ----------------
 const fetchTasks = async () => {
  try {
    const res = await API.get("/tasks");

    const serverTasks = res.data;
    const local = JSON.parse(localStorage.getItem("tasks")) || [];

    // keep offline tasks also
    const offlineTasks = local.filter(task => task.offline);

    // merge both
    const merged = [...offlineTasks, ...serverTasks];

    setTasks(merged);

    // update local storage
    localStorage.setItem("tasks", JSON.stringify(merged));

  } catch (error) {
  }
};

  // first load
  useEffect(() => {
    fetchTasks();
  }, []);

  // ---------------- OFFLINE SYNC ----------------
useEffect(() => {

  const syncTasks = async () => {
  if (!navigator.onLine) return;

  try {
    // get locally stored tasks
    const local = JSON.parse(localStorage.getItem("tasks")) || [];

    // ---------------- SYNC OFFLINE ADDED TASKS ----------------
    const offlineTasks = local.filter(task => task.offline);

    for (const task of offlineTasks) {
      await API.post("/tasks", {
        title: task.title,
        dueDate: task.dueDate
      });
    }

    // ---------------- PROCESS PENDING ACTIONS ----------------
    const pending = JSON.parse(localStorage.getItem("pendingActions")) || [];

    for (const action of pending) {
      try {
        if (action.type === "delete") {
          await API.delete(`/tasks/${action.id}`);
        }

        if (action.type === "toggle") {
          await API.put(`/tasks/${action.id}`);
        }
      } catch (err) {
        console.log("Pending action failed:", action);
      }
    }

    // clear queue after success
    localStorage.removeItem("pendingActions");

    // ---------------- RELOAD CLEAN SERVER DATA ----------------
    const res = await API.get("/tasks");

    setTasks(res.data);
    localStorage.setItem("tasks", JSON.stringify(res.data));

  } catch (err) {
    console.log("Sync failed");
  }
};

  // run when internet returns
  window.addEventListener("online", syncTasks);

  // ALSO run when dashboard opens (important)
  syncTasks();

  return () => window.removeEventListener("online", syncTasks);

}, []);

  // ---------------- ADD TASK ----------------
  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    const newTask = {
      _id: Date.now().toString(),
      title,
      dueDate,
      completed: false,
      offline: true
    };

    // OFFLINE SAVE
    if (!navigator.onLine) {

      const saved = JSON.parse(localStorage.getItem("tasks")) || [];
      const updated = [newTask, ...saved];

      localStorage.setItem("tasks", JSON.stringify(updated));
      setTasks(updated);

      setTitle("");
      setDueDate("");
      return;
    }

    // ONLINE SAVE
    await API.post("/tasks", { title, dueDate });
    setTitle("");
    setDueDate("");
    fetchTasks();
  };

  // ---------------- DELETE ----------------
  const deleteTask = async (id) => {

  // OFFLINE DELETE
  if (!navigator.onLine) {

    // remove from UI
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const updated = saved.filter(task => task._id !== id);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated);

    // queue delete action
    const pending = getPending();
    pending.push({ type: "delete", id });
    setPending(pending);

    return;
  }

  // ONLINE DELETE
  await API.delete(`/tasks/${id}`);
  fetchTasks();
};
  // ---------------- TOGGLE COMPLETE ----------------
  const toggleTask = async (id) => {

  // OFFLINE TOGGLE
  if (!navigator.onLine) {

    const saved = JSON.parse(localStorage.getItem("tasks")) || [];

    const updated = saved.map(task =>
      task._id === id ? { ...task, completed: !task.completed } : task
    );

    localStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated);

    // queue toggle action
    const pending = getPending();
    pending.push({ type: "toggle", id });
    setPending(pending);

    return;
  }

  // ONLINE TOGGLE
  await API.put(`/tasks/${id}`);
  fetchTasks();
};

 return (
  <div className="min-h-screen bg-slate-100 flex flex-col">

    {/* TOP BAR */}
    <div className="bg-indigo-600 text-white p-5 shadow-md">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">
            Hello, {user?.user?.name} 👋
          </h1>
          <p className="text-sm opacity-80">
            {new Date().toDateString()}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-white/20 px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-white/30 transition"
        >
          Logout
        </button>
      </div>
    </div>

    {/* CONTENT */}
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">

      {/* ADD TASK CARD */}
      <form
        onSubmit={addTask}
        className="bg-white rounded-2xl shadow-lg p-5 mb-8 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="What do you want to study today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border rounded-xl px-4 py-3 hover:cursor-pointer"
        />

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:cursor-pointer hover:bg-indigo-700 transition">
          Add Task
        </button>
      </form>

      {/* TASK LIST */}
      <div className="space-y-4">

        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg">No study tasks yet 📚</p>
            <p className="text-sm">Add your first task and start learning!</p>
          </div>
        ) : (

          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition"
            >

              <div className="flex items-center gap-4">

                {/* TOGGLE */}
                <button
                  onClick={() => toggleTask(task._id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer
                    ${task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-400"
                    }`}
                >
                  {task.completed && "✓"}
                </button>

                {/* TEXT */}
                <div>
                  <p className={`text-lg font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                    {task.title}
                  </p>

                  {task.dueDate && (
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toDateString()}
                    </p>
                  )}

                  {task.offline && (
                    <p className="text-xs text-orange-500">
                      Saved offline – will sync
                    </p>
                  )}
                </div>

              </div>

              {/* DELETE */}
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700 hover:cursor-pointer font-bold text-lg"
              >
                ✕
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default Dashboard;