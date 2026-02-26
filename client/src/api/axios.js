import axios from "axios";

// ⚠️ DO NOT USE import.meta.env for now
// Hardcode the real Render backend URL

const API = axios.create({
  baseURL: "https://smart-study-backend-w1pr.onrender.com/api",
  withCredentials: false
});

// attach token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;