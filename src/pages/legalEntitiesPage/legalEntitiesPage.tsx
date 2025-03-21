import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";

export const LegalEntiteisPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Юр. лица", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);
  return <div>legal_entities</div>;
};
