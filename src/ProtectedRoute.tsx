// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Breadcrumbs from "./Breadcrumbs";

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
