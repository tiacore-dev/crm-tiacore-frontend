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
        <Button
          type="primary"
          danger
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
          }}
          icon={<LogoutOutlined />}
        >
          Выйти
        </Button>
      </div>
    </div>
  );
};
