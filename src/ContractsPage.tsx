import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const ContractsPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Контракты", to: "/contracts" },
        ]}
      />
      contracts
    </div>
  );
};

export default ContractsPage;
