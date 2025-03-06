import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axiosConfig";
import "./LoginPage.css";

type FormData = {
  username: string;
  password: string;
};

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

  const navigate = useNavigate();

  // Используем useMutation для выполнения запроса на авторизацию
  const loginMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: async (data) => {
      const url = process.env.REACT_APP_API_URL;
      if (!url) {
        throw new Error("REACT_APP_API_URL is not defined");
      }

      try {
        const response = await axiosInstance.post<AuthResponse>(
          `${url}/api/auth/token`,
          data
        );
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Ошибка при авторизации:", error.message);
          throw new Error(error.message);
        } else {
          console.error("Неизвестная ошибка:", error);
          throw new Error("Неизвестная ошибка");
        }
      }
    },
    onSuccess: (data) => {
      // Сохраняем токены в localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      // Перенаправляем на /home
      navigate("/home");
    },
    onError: (error) => {
      console.error("Ошибка при авторизации:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data); // Выполняем запрос
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Вход</h2>
        {loginMutation.isError && (
          <div className="error-message">Ошибка при авторизации</div>
        )}
        <div className="form-group">
          <label htmlFor="username">Логин</label>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Логин обязателен" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="username"
                className={errors.username ? "error" : ""}
                disabled={loginMutation.isPending}
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
            rules={{ required: "Пароль обязателен" }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="password"
                className={errors.password ? "error" : ""}
                disabled={loginMutation.isPending}
              />
            )}
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="login-button"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
