import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Breadcrumbs from "./Breadcrumbs";

const ProtectedRoute: React.FC = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }
    setIsValidToken(!!accessToken);
  }, [navigate]);

  if (isValidToken === null) {
    return null; // Можно добавить загрузочный экран здесь
  }

  // const generateBreadcrumbs = () => {
  //   const paths = [
  //     { label: "Home", to: "/home" },
  //     ...location.pathname.split("/").map((segment, index, arr) => ({
  //       label: segment.charAt(0).toUpperCase() + segment.slice(1),
  //       to: "/" + arr.slice(1, index + 1).join("/"),
  //     })),
  //   ];
  //   return paths;
  // };

  return isValidToken ? (
    <>
      <Navbar />
      {/* <Breadcrumbs paths={generateBreadcrumbs()} /> */}
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
