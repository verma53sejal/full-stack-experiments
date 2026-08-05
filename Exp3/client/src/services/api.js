import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        toast.error("Session expired");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }

      if (err.response.status === 403) {
        toast.error("Access denied");
      }
    }

    return Promise.reject(err);
  }
);

export default api;