import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api", // ✅ production via Netlify proxy
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
