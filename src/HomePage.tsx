import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import refreshToken from "./auth";
import axiosInstance from "./axiosConfig";

const fetchUserData = async () => {
  const url = process.env.REACT_APP_API_URL;

  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get(
    `${url}/api/get-all/legal-entity-types`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const HomePage: React.FC = () => {
  // const [shouldFetch, setShouldFetch] = useState(false); //
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    // enabled: shouldFetch,
  });

  const handleFetchData = () => {
    // setShouldFetch(true); // Включаем запрос
    refetch(); // Выполняем запрос
  };

  const tryRefresh = () => {
    refreshToken();
  };

  return (
    <div>
      <h1>Вы успешно авторизовались!</h1>
      <button onClick={handleFetchData}> данные?</button>

      {data && (
        <div>
          <h2>Ваши данные:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      <button onClick={tryRefresh}>обновить токен</button>
    </div>
  );
};

export default HomePage;
