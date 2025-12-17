import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true, // IMPORTANT for sessions/cookies
});

export default api;
