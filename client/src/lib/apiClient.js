import axios from "axios";
import { getUrlApiWithPath } from "../utils/url_api";

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Transform the URL using the existing utility
    if (config.url && !config.url.startsWith("http")) {
      // Remove leading slash to prevent double slash
      const cleanPath = config.url.startsWith("/") ? config.url.substring(1) : config.url;
      config.url = getUrlApiWithPath(cleanPath);
    }

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
