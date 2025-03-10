import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
// import refreshToken from "./auth"; // Импортируем функцию обновления токена
import Navbar from "./Navbar"; // Импортируем Navbar

const ProtectedRoute: React.FC = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const location = useLocation();
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
  }, [navigate]);

  if (isValidToken === null) {
    return null; // Пока проверяется токен — ничего не рендерим
  }

  return isValidToken ? (
    <>
      {/* Отображаем Navbar только на защищенных страницах */}
      <Navbar />
      <Outlet /> {/* Рендерим дочерние маршруты */}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};
export default ProtectedRoute;
