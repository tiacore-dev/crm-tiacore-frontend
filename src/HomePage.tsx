import React from "react";
import { useQuery } from "@tanstack/react-query";
import refreshToken from "./auth";
import axiosInstance from "./axiosConfig";

const fetchEntityTypes = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(
    `${url}/api/get-all/legal-entity-types`,
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
  const response = await axiosInstance.get(
    `${url}/api/get-all/contract-statuses/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const fetchUserRoles = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/get-all/user-roles/`, {
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

  return (
    <div>
      <h1>Вы успешно авторизовались!</h1>
      <button onClick={tryRefresh}>Обновить токен</button>

      {/* <button onClick={logOut}>Выйти</button> */}
    </div>
  );
};

export default HomePage;
