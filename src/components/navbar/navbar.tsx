import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Button } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import "./navbar.css"; // Импорт стилей

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  // Основные пункты меню
  const mainItems = [
    { label: "Главная", key: "/home" },
    { label: "Юр. лица", key: "/legal_entities" },
    { label: "Договоры", key: "/contracts" },
    { label: "Банковские счета", key: "/bank_accounts" },
    { label: "Счета", key: "/bills" },
    { label: "Акты", key: "/acts" },
  ];

  // Дополнительные пункты меню (настройки)
  const settingsItems = [
    { label: "Услуги", key: "/services" },
    { label: "Пользователи", key: "/users" },
    { label: "Компании", key: "/companies" },
    { label: "Шаблоны", key: "/templates" },
    {
      label: "Управление доступом",
      key: "/role_permissions_relations",
    },
  ];

  // Функция для определения активного пункта меню
  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const allItems = [...mainItems, ...settingsItems];
    const matchedItem = allItems.find((item) =>
      currentPath.startsWith(item.key)
    );
    return matchedItem ? [matchedItem.key] : [];
  };

  // Обработчик переключения настроек
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className={`navbar-container ${showSettings ? "settings-open" : ""}`}>
      {/* Основное меню (всегда видимое) */}
      <Menu
        className="navbar-menu"
        mode="horizontal"
        items={mainItems}
        selectedKeys={getSelectedKeys()}
        onClick={({ key }) => navigate(key)}
      />

      {/* Дополнительное меню (появляется при нажатии на настройки) */}
      {showSettings && (
        <Menu
          className="settings-menu"
          mode="horizontal"
          items={settingsItems}
          selectedKeys={getSelectedKeys()}
          onClick={({ key }) => navigate(key)}
        />
      )}

      {/* Кнопки */}
      <div className="buttons-container">
        <Button
          type="text"
          icon={
            <SettingOutlined
              className={`rotate-icon ${
                showSettings
                  ? "rotate-icon-anticlockwise"
                  : "rotate-icon-clockwise"
              }`}
            />
          }
          onClick={toggleSettings}
        >
          Настройки
        </Button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
          }}
        >
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          </div>
          <div className="text">Выйти</div>
        </button>
      </div>
    </div>
  );
};
