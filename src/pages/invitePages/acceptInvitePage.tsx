import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../axiosConfig";
import toast from "react-hot-toast";
import { Typography, Spin, Space } from "antd";

export const AcceptInvitePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { Title } = Typography;

  // Извлекаем токен из URL параметров
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  // Мутация для принятия приглашения
  const acceptInviteMutation = useMutation({
    mutationFn: (token: string) =>
      axiosInstance.get(`/api/accept-invite?token=${token}`),
    onSuccess: (response) => {
      toast.success("Приглашение успешно принято!");
      // Перенаправляем пользователя на нужную страницу
      // Можно использовать данные из response.data для определения куда перенаправлять
      navigate("/home"); // Или другой путь из ответа API
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Ошибка при принятии приглашения"
      );
      // Перенаправляем на страницу входа при ошибке
      navigate("/login");
    },
  });

  // При монтировании компонента выполняем запрос
  useEffect(() => {
    if (token) {
      acceptInviteMutation.mutate(token);
    } else {
      toast.error("Токен приглашения отсутствует");
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="login_container">
      <div className="form">
        {acceptInviteMutation.isPending ? (
          <Space direction="vertical" align="center">
            <Title level={3} className="form-title">
              Обработка приглашения...
            </Title>
            <Spin size="large" />
          </Space>
        ) : acceptInviteMutation.isError ? (
          <Title level={3} className="form-title" style={{ color: "red" }}>
            Ошибка при обработке приглашения
          </Title>
        ) : acceptInviteMutation.isSuccess ? (
          <Title level={3} className="form-title" style={{ color: "green" }}>
            Перенаправление...
          </Title>
        ) : null}
      </div>
    </div>
  );
};
