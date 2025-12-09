import axios from "axios";

let API_BASE_URL;

if (import.meta.env.MODE === "development") {
  API_BASE_URL = "http://localhost:5001/api";
} else {
  const backendHost = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
  API_BASE_URL = `${backendHost}/api`;
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
