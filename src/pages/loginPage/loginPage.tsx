//loginpage.tsx
import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../axiosConfig";
import toast from "react-hot-toast";
import { Button, Typography, Spin } from "antd";
import "./loginPage.css";
import { FloatingInput } from "../../components/floatingInput/floatingInput";

type FormData = {
  username: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  permissions: Record<string, string[]>; // Добавляем permissions
  is_superadmin: boolean; // Добавляем is_superadmin
};

type ApiError = {
  response?: {
    data: {
      message: string;
    };
  };
};

export const LoginPage: React.FC = () => {
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

  const loginMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: async (data) => {
      const url = process.env.REACT_APP_API_URL;
      if (!url) throw new Error("REACT_APP_API_URL is not defined");

      try {
        const response = await axiosInstance.post<AuthResponse>(
          `${url}/api/auth/token`,
          data
        );
        return response.data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.response?.data.message || "Ошибка при авторизации";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("is_superadmin", data.is_superadmin.toString());
      if (!data.is_superadmin) {
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        const companyIds = Object.keys(data.permissions);
        if (companyIds.length > 0) {
          localStorage.setItem("selectedCompanyId", companyIds[0]);
        }
      }

      window.location.href = "/home";
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      loginMutation.mutate(data);
    },
    [loginMutation]
  );

  return (
    <div className="login_container">
      <div className="form">
        <Typography.Title level={3} className="form-title">
          Вход
        </Typography.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Логин */}
          <Controller
            name="username"
            control={control}
            rules={{ required: "Логин обязателен" }}
            render={({ field }) => (
              <FloatingInput
                id="username"
                name="Логин"
                value={field.value}
                onChange={field.onChange}
                disabled={loginMutation.isPending}
                hint="Введите логин"
              />
            )}
          />
          {errors.username && (
            <div className="error-text">{errors.username.message}</div>
          )}

          {/* Пароль */}
          <Controller
            name="password"
            control={control}
            rules={{ required: "Пароль обязателен" }}
            render={({ field }) => (
              <FloatingInput
                id="password"
                name="Пароль"
                type="password"
                value={field.value}
                onChange={field.onChange}
                disabled={loginMutation.isPending}
                hint="Минимум 6 символов"
              />
            )}
          />
          {errors.password && (
            <div className="error-text">{errors.password.message}</div>
          )}

          <Button
            htmlType="submit"
            className="button"
            // type="primary"
            size="large"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <Spin size="small" /> : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
};
