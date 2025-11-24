import axios from "axios";

// 1. Determine the base URL for the API calls.
let API_BASE_URL;

if (import.meta.env.MODE === "development") {
  // For local development, use localhost
  API_BASE_URL = "http://localhost:5001/api";
} else {
  const backendHost = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
  API_BASE_URL = `${backendHost}/api`;
}

// 2. Create and export the Axios instance with the correct base URL.
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
