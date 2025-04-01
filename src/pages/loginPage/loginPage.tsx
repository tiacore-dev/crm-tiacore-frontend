import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../axiosConfig";
import toast from "react-hot-toast";
import { Button, Form, Input, Typography, Spin } from "antd";
import "./loginPage.css";

type FormData = {
  username: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
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
        const apiError = error as ApiError;
        if (apiError.response) {
          const errorMessage =
            apiError.response.data.message || "Ошибка при авторизации";
          throw new Error(errorMessage);
        } else {
          throw new Error("Неизвестная ошибка");
        }
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/home");
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
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        style={{ maxWidth: 400, margin: "0 auto" }}
      >
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Вход
        </Typography.Title>

        {/* Поле для логина */}
        <Form.Item
          label="Логин"
          validateStatus={errors.username ? "error" : ""}
          help={errors.username?.message}
        >
          <Controller
            name="username"
            control={control}
            rules={{ required: "Логин обязателен" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите логин"
                disabled={loginMutation.isPending}
              />
            )}
          />
        </Form.Item>

        {/* Поле для пароля */}
        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: "Пароль обязателен" }}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Введите пароль"
                disabled={loginMutation.isPending}
              />
            )}
          />
        </Form.Item>

        {/* Кнопка отправки формы */}
        <Form.Item>
          <Button htmlType="submit" disabled={loginMutation.isPending} block>
            {loginMutation.isPending ? (
              <Spin size="small" className="center-spin" />
            ) : (
              "Войти"
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
