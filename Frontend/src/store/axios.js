import axios from "axios";

const axiosInstance = axios.create({
  baseURL: typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "https://crowd-funding-app.onrender.com/api"
});

/*
Attach JWT token
*/
axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
Handle expired token
*/
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("Axios error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;