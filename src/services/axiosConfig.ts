import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  // Logic to send auth token to backend with each request
  return config;
});

export { axiosInstance };
