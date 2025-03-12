import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const BankPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Банковские данные", to: "/bank_accounts" },
        ]}
      />
      bank_accounts
    </div>
  );
};

export default BankPage;
