import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Breadcrumb } from "antd";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.paths
  );

  // Скрываем крошки на странице 404
  if (location.pathname === "/404") {
    return null;
  }

  const breadcrumbItems = breadcrumbs.map((path, index) => ({
    title:
      index === breadcrumbs.length - 1 ? (
        path.label
      ) : (
        <Link to={path.to}>{path.label}</Link>
      ),
  }));

  return <Breadcrumb style={{ margin: "1%" }} items={breadcrumbItems} />;
};
