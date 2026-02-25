import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated px-4">

      {/* Glass Card */}
      <div className="glass w-full max-w-md p-8 text-white">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account ✨
        </h1>

        <p className="text-center text-white/80 mb-8">
          Start planning your study smarter
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          {/* BUTTON */}
          <button className="w-full py-3 rounded-xl font-semibold bg-white text-indigo-600 hover:scale-105 active:scale-95 transition transform shadow-xl">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-white/80">
          Already have an account?{" "}
          <Link to="/" className="underline font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;