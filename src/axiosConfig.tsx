import axios from "axios";
import refreshToken from "./auth"; // Импортируем функцию обновления токена

const axiosInstance = axios.create({});
// baseURL: process.env.REACT_APP_API_URL
axiosInstance.interceptors.response.use(
  (response) => response, // Если ответ успешный, просто возвращаем его
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Помечаем запрос как повторный

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/"; // Перенаправляем на страницу входа
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
