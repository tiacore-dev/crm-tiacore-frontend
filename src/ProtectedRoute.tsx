// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { Breadcrumbs } from "./components/Breadcrumbs/Breadcrumbs";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
