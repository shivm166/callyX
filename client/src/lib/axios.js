import axios from "axios";

const BASE_URL =
  import.meta.env.MODE == "development" ? "http://localhost:5173/" : "/api/v1";
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
