import axios from "axios";
import refreshToken from "./auth"; // Импортируем функцию обновления токена

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response, // Если ответ успешный, просто возвращаем его
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Помечаем запрос как повторный

      // Пытаемся обновить токен
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        // Если токен обновлен, повторяем оригинальный запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    // Если токен не удалось обновить, перенаправляем на страницу входа
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/"; // Перенаправляем на страницу входа
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
