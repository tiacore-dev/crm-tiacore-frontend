import React, { useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "./redux/slices/breadcrumbsSlice";

const LegalEntityPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/" },
        { label: "Юрю лица", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);
  return <div>legal_entities</div>;
};

export default LegalEntityPage;
