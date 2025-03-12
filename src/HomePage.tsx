import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import refreshToken from "./auth";
import axiosInstance from "./axiosConfig";
import Breadcrumbs from "./Breadcrumbs";

const fetchEntityTypes = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/legal-entity-types/all`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const fetchContractStatuses = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/contract-statuses/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const fetchUserRoles = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/user-roles/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const HomePage: React.FC = () => {
  const { data: entityTypes } = useQuery({
    queryKey: ["entityTypes"],
    queryFn: fetchEntityTypes,
  });

  const { data: contractStatuses } = useQuery({
    queryKey: ["contractStatuses"],
    queryFn: fetchContractStatuses,
  });

  const { data: userRoles } = useQuery({
    queryKey: ["userRoles"],
    queryFn: fetchUserRoles,
  });

  const tryRefresh = () => {
    refreshToken();
  };

  // useEffect(() => {
  //   if (entityTypes) {
  //     console.log("Данные с сервера:", entityTypes.legal_entity_types);
  //   }
  // }, [entityTypes]);

  return (
    <div>
      <Breadcrumbs paths={[{ label: "Главная страница", to: "/" }]} />
      <h1>Вы успешно авторизовались!</h1>
      <button onClick={tryRefresh}>Обновить токен</button>
      {/* <button onClick={logOut}>Выйти</button> */}
    </div>
  );
};

export default HomePage;
