
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/", // Default API URL
  withCredentials: true, // if you need cookies/sessions
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401 &&
        !error.config.url.includes("/login") &&
  !error.config.url.includes("/register")
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/Auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
