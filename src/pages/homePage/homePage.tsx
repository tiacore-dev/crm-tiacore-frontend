import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { refreshToken } from "../loginPage/auth";
import {
  fetchEntityTypes,
  fetchContractStatuses,
  fetchUserRoles,
} from "../../api/homeApi";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { Button, Typography, Spin } from "antd"; // Импорт компонентов Ant Design
import { ILegalEntityType } from "../legalEntitiesPage/components/legalEntityCreateModal";
import { ILegalEntityTypesResponse } from "../../api/homeApi";

export const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Главная страница", to: "/home" }]));
  }, [dispatch]);

  const { data: entityTypesResponse, isLoading: isLoadingEntityType } =
    useQuery<ILegalEntityTypesResponse>({
      queryKey: ["entityTypes"],
      queryFn: fetchEntityTypes,
    });

  const { data: contractStatuses, isLoading: isLoadingContractStatuses } =
    useQuery({
      queryKey: ["contractStatuses"],
      queryFn: fetchContractStatuses,
    });

  const { data: userRoles, isLoading: isLoadingUserRoles } = useQuery({
    queryKey: ["userRoles"],
    queryFn: fetchUserRoles,
  });

  const tryRefresh = () => {
    refreshToken();
  };

  return (
    <div className="main-container">
      <Typography.Title level={1}>Вы успешно авторизовались!</Typography.Title>

      {/* Кнопка для обновления токена */}
      <Button onClick={tryRefresh}>Обновить токен</Button>

      {/* Отображение данных с индикацией загрузки */}
      {/* <div style={{ marginTop: 24 }}>
        <Typography.Title level={3}>Типы сущностей</Typography.Title>
        {isLoadingEntityTypes ? (
          <Spin />
        ) : (
          <Typography.Text>{JSON.stringify(entityTypes)}</Typography.Text>
        )}

        <Typography.Title level={3} style={{ marginTop: 16 }}>
          Статусы контрактов
        </Typography.Title>
        {isLoadingContractStatuses ? (
          <Spin />
        ) : (
          <Typography.Text>{JSON.stringify(contractStatuses)}</Typography.Text>
        )}

        <Typography.Title level={3} style={{ marginTop: 16 }}>
          Роли пользователей
        </Typography.Title>
        {isLoadingUserRoles ? (
          <Spin />
        ) : (
          <Typography.Text>{JSON.stringify(userRoles)}</Typography.Text>
        )}
      </div> */}
    </div>
  );
};
