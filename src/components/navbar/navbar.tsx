// navbar.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Button, Dropdown } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useCompany } from "../../context/companyContext";
import "./navbar.css";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { queryClient } from "../../context/companyContext";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    availableCompanies,
    isSuperadmin,
  } = useCompany();

  // Получаем данные о всех компаниях
  const { data: companiesData } = useCompanyQuery();
  const companies = companiesData?.companies || [];

  // Основные пункты меню
  const mainItems = [
    { label: "Главная", key: "/home" },
    { label: "Контрагенты", key: "/legal_entities" },
    { label: "Договоры", key: "/contracts" },
    // { label: "Банковские счета", key: "/bank_accounts" },
    { label: "Счета", key: "/bills" },
    { label: "Акты", key: "/acts" },
  ];

  // Дополнительные пункты меню (настройки)
  const settingsItems = [
    { label: "Услуги", key: "/services" },
    { label: "Компании", key: "/companies" },
    { label: "Шаблоны", key: "/templates" },
    ...(isSuperadmin
      ? [
          { label: "Пользователи", key: "/users" },
          { label: "Управление доступом", key: "/role_permissions_relations" },
        ]
      : []),
  ];

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const allItems = [...mainItems, ...settingsItems];
    const matchedItem = allItems.find((item) =>
      currentPath.startsWith(item.key)
    );
    return matchedItem ? [matchedItem.key] : [];
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Создаем элементы для выпадающего меню выбора компании
  const companyMenuItems = availableCompanies.map((companyId) => {
    const company = companies.find((c) => c.company_id === companyId);
    return {
      key: companyId,
      label: company ? company.company_name : companyId,
      onClick: () => setSelectedCompanyId(companyId),
    };
  });

  // Получаем название выбранной компании
  const selectedCompanyName =
    companies.find((c) => c.company_id === selectedCompanyId)?.company_name ||
    selectedCompanyId;

  return (
    <div className={`navbar-container ${showSettings ? "settings-open" : ""}`}>
      {/* Основное меню */}
      <Menu
        className="navbar-menu"
        mode="horizontal"
        items={mainItems}
        selectedKeys={getSelectedKeys()}
        onClick={({ key }) => navigate(key)}
      />

      {/* Дополнительное меню (настройки) */}
      {showSettings && (
        <Menu
          className="settings-menu"
          mode="horizontal"
          items={settingsItems}
          selectedKeys={getSelectedKeys()}
          onClick={({ key }) => navigate(key)}
        />
      )}

      {/* Кнопки и выбор компании */}
      <div className="buttons-container">
        {!isSuperadmin && (
          <Dropdown menu={{ items: companyMenuItems }} placement="bottomRight">
            <Button className="company-selector">
              {selectedCompanyName || "Выберите компанию"}
            </Button>
          </Dropdown>
        )}

        <button className="animated-settings-btn" onClick={toggleSettings}>
          <div className="sign">
            <div className="text">Настройки</div>
            <SettingOutlined
              className={`rotate-icon ${
                showSettings
                  ? "rotate-icon-anticlockwise"
                  : "rotate-icon-clockwise"
              }`}
            />
          </div>
        </button>

        <button
          className="animated-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          <div className="sign">
            <LogoutOutlined />
          </div>
          <div className="text">Выйти</div>
        </button>
      </div>
    </div>
  );
};
