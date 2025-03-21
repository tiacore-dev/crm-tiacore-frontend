import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";

export const CompaniesPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Компании", to: "/companies" },
      ])
    );
  }, [dispatch]);
  return <div>companies</div>;
};
