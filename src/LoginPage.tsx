import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig"; // Используем настроенный axios
import axios from "axios"; // Импортируем axios для isAxiosError
import "./LoginPage.css";

// Типы для данных формы
type FormData = {
  username: string;
  password: string;
};

// Типы для ответа от сервера
type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки
  const navigate = useNavigate(); // Хук для навигации

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    console.log("onSubmit");

    try {
      // Отправляем POST-запрос на сервер
      const url = process.env.REACT_APP_API_URL;
      const response = await axiosInstance.post<AuthResponse>(
        `${url}/api/auth/token`,
        data
      );
      console.log("Успешная авторизация:", response.data);

      // Сохраняем токен в localStorage
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      // Перенаправляем пользователя на главную страницу
      navigate("/home");
    } catch (err) {
      // Обрабатываем ошибку
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Ошибка при авторизации");
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false); // Выключаем состояние загрузки
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Вход</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Логин</label>
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Логин обязателен",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="username"
                className={errors.username ? "error" : ""}
                disabled={loading}
              />
            )}
          />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пароль обязателен",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="password"
                className={errors.password ? "error" : ""}
                disabled={loading}
              />
            )}
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
