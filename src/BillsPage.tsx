import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const BillsPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Счета", to: "/bills" },
        ]}
      />
      bills
    </div>
  );
};

export default BillsPage;
