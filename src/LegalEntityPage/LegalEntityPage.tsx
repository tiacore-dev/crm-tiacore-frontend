import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../redux/slices/breadcrumbsSlice";

export const LegalEntityPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/" },
        { label: "Юр. лица", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);
  return <div>legal_entities</div>;
};
