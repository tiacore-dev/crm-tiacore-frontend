import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import refreshToken from "./auth"; // Импортируем функцию обновления токена

const ProtectedRoute: React.FC = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        // Если access_token отсутствует, пытаемся обновить токен
        const newAccessToken = await refreshToken();
        setIsValidToken(!!newAccessToken);
      } else {
        setIsValidToken(true);
      }
    };

    checkToken();
  }, []);

  if (isValidToken === null) {
    return null; // Или индикатор загрузки
  }

  return isValidToken ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
