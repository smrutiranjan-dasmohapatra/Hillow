import axios from "axios";

const api = axios.create({
  baseURL: "https://hillow-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
