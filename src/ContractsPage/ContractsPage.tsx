import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../redux/slices/breadcrumbsSlice";

export const ContractsPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/" },
        { label: "Контаркты", to: "/contracts" },
      ])
    );
  }, [dispatch]);
  return <div>contracts</div>;
};
