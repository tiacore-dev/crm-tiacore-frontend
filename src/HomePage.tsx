import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import refreshToken from "./auth";
// import axiosInstance from "./axiosConfig";
import Breadcrumbs from "./Breadcrumbs";
import {
  fetchEntityTypes,
  fetchContractStatuses,
  fetchUserRoles,
} from "./api/homeApi";
// import { fetchEntityTypes, createService } from "./api/servicesApi"; // Импортируем запросы

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
      <Breadcrumbs paths={[{ label: "Главная страница", to: "/" }]} />
      {/* {!isError && ( <> */}
      <h1>Вы успешно авторизовались!</h1>
      <button onClick={tryRefresh}>Обновить токен</button>
      {/* </>)} */}
    </div>
  );
};

export default HomePage;
