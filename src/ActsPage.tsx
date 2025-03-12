import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const ActsPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Акты", to: "/acts" },
        ]}
      />
      acts
    </div>
  );
};

export default ActsPage;
