import React, { useEffect } from "react";
import { refreshToken } from "../loginPage/auth";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { Button, Typography } from "antd"; // Импорт компонентов Ant Design
import { BackButton } from "../../components/buttons/backButton";

export const NotFoundPage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Главная страница", to: "/home" }]));
  }, [dispatch]);

  return (
    <div className="main-container">
      <Typography.Title level={1}>Страница не найдена</Typography.Title>
      {/* Кнопка для обновления токена */}
      <BackButton />{" "}
    </div>
  );
};
