import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const LegalEntityPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Юридические лица", to: "/legal_entities" },
        ]}
      />
      legal_entities
    </div>
  );
};

export default LegalEntityPage;
