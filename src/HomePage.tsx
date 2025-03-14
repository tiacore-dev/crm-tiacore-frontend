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
import { setBreadcrumbs } from "./redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";

// import { fetchEntityTypes, createService } from "./api/servicesApi"; // Импортируем запросы

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Главная страница", to: "/" }]));
  }, [dispatch]);

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
      {/* {!isError && ( <> */}
      <h1>Вы успешно авторизовались!</h1>
      <button onClick={tryRefresh}>Обновить токен</button>
      {/* </>)} */}
    </div>
  );
};

export default HomePage;
