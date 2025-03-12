import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const UsersPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Главная страница", to: "/" },
          { label: "Пользователи", to: "/users" },
        ]}
      />
      users
    </div>
  );
};

export default UsersPage;
