import React, { useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "./redux/slices/breadcrumbsSlice";

const ContractsPage: React.FC = () => {
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

export default ContractsPage;
