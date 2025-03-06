import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import refreshToken from "./auth"; // Импортируем функцию обновления токена

const ProtectedRoute: React.FC = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // const checkToken = () => {
    const accessToken = localStorage.getItem("access_token");
    console.log(accessToken);
    if (!accessToken) {
      navigate("/login");
      // Если access_token отсутствует, пытаемся обновить токен
      // accessToken = await refreshToken();
      return; // Пока проверяется токен — ничего не рендерим
    }

    setIsValidToken(!!accessToken); // Если токен есть — доступ разрешен, иначе нет
    // };

    // checkToken();
  }, []);

  if (isValidToken === null) {
    return null; // Пока проверяется токен — ничего не рендерим
  }

  return isValidToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
