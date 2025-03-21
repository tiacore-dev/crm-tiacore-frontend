import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, Button } from "antd"; // Импорт компонентов Ant Design
// import "./Navbar.css"; // Стили для навигации

const logOut = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    { label: "Главная", key: "/home" },
    { label: "Услуги", key: "/services" },
    { label: "Пользователи", key: "/users" },
    { label: "Компании", key: "/companies" },
    { label: "Юр. лица", key: "/legal_entities" },
    { label: "Контракты", key: "/contracts" },
    { label: "Банк", key: "/bank_accounts" },
    { label: "Счета", key: "/bills" },
    { label: "Акты", key: "/acts" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Menu
        mode="horizontal"
        items={items}
        selectedKeys={[window.location.pathname]}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, minWidth: 0 }}
      />
      <Button type="primary" danger onClick={logOut}>
        Выйти
      </Button>
    </div>
  );
};
