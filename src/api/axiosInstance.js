import axios from "axios";
import { getStoredToken, clearAuth } from "@/utils/storage";

const { VITE_APP_BASE_URL } = import.meta.env;

const axiosInstance = axios.create({
  baseURL: VITE_APP_BASE_URL,
  // timeout: 10000, // Request timeout
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Attach Authorization header if token exists in localStorage
    const token = getStoredToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Set default content type (skip for FormData - axios will set it automatically with boundary)
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    // Debug log for signup OTP request
    if (config.url?.includes("signup") && config.url?.includes("otp-request")) {
      console.log("Axios Request Config:", {
        url: config.url,
        method: config.method,
        data: config.data,
        fullConfig: config
      });
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response here if needed
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Handle different status codes globally
      switch (response.status) {
        case 401: // Unauthorized
          // Clear auth and redirect to login
          clearAuth();
          // Only redirect if not already on login page
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;
        case 403: // Forbidden
          // Handle forbidden response
          break;
        case 500: // Internal Server Error
          // Handle server error
          break;
        default:
          // Handle other responses
          break;
      }
    }

    // Reject the promise to continue with the error handling in the request-specific code
    return Promise.reject(error);
  }
);

export default axiosInstance;
