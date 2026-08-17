import axios from "axios";
import { BACKEND_API_URL } from "../api/config";

const api = axios.create({
  baseURL: BACKEND_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (
      (status === 401 || status === 403) &&
      message === "Session expired, Kindly login to continue"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;