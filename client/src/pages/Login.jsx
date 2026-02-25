import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // auto redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {

      if (!navigator.onLine) {
        alert("You are offline. Connect internet for first login.");
      } else {
        alert("Invalid Credentials");
      }
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-animated px-4">

    {/* CARD */}
    <div className="glass w-full max-w-md p-8 text-white">

      <h1 className="text-3xl font-bold text-center mb-2">
        Smart Study Planner
      </h1>

      <p className="text-center text-white/80 mb-8">
        Plan smarter. Study better.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* EMAIL */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-white transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-white transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* BUTTON */}
        <button className="w-full py-3 rounded-xl font-semibold bg-white text-indigo-600 hover:scale-105 active:scale-95 transition transform shadow-lg">
          Login
        </button>

      </form>

      <p className="text-center text-sm mt-6 text-white/80">
        New here?{" "}
        <Link to="/register" className="underline font-semibold">
          Create account
        </Link>
      </p>

    </div>
  </div>
);
}

export default Login;