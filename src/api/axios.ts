import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SPORTBOOK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/auth"; // Redirigir al login
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
    }
    return Promise.reject(error);
  }
);

export default api;
