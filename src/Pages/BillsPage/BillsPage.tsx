import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";

export const BillsPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Счета", to: "/bills" },
      ])
    );
  }, [dispatch]);
  return <div>bills</div>;
};
