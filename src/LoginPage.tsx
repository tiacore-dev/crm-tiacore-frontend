import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios"; // Импортируем axios
import "./LoginPage.css"; // Подключаем стили

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    // console.log(
    //   "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    //   data
    // );

    try {
      // Используем process.env.REACT_APP_API_URL для формирования URL???????????
      const response = await axios.post(
        `${process.env.API_URL}/api/auth/token`,
        data
      );

      console.log("Успешная авторизация:", response.data);

      // Сохраняем токен в localStorage
      localStorage.setItem("token", response.data.token);

      // Перенаправление на другую страницу (например, на главную)
      window.location.href = "/";
    } catch (err) {
      // Обрабатываем ошибку
      setError(err.response?.data?.message || "Ошибка при авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Вход</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Логин</label>{" "}
          {/* Заменяем email на username */}
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Логин обязателен",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text" // Меняем тип на text
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
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
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

// try {
//   // Используем process.env.REACT_APP_API_URL для формирования URL???????????
//   const response = await axios.post(
//     `${process.env.API_URL}/api/auth/token`,
//     data
//   );
