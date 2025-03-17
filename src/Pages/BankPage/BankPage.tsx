import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";

export const BankPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Банк", to: "/bank_accounts" },
      ])
    );
  }, [dispatch]);

  return <div>bank_accounts</div>;
};
