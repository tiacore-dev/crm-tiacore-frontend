import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../redux/slices/breadcrumbsSlice";

const ActsPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/" },
        { label: "Акты", to: "/acts" },
      ])
    );
  }, [dispatch]);
  return <div>acts</div>;
};

export default ActsPage;
