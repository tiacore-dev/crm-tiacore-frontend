import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Button, Dropdown, Drawer } from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useCompany } from "../../context/companyContext";
import "./navbar.css";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { useMobileDetection } from "../../hooks/useMobileDetection";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileDetection();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Перенесли вызов хука в начало
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    availableCompanies,
    isSuperadmin,
  } = useCompany();

  const { data: companiesData } = useCompanyQuery();
  const companies = companiesData?.companies || [];

  const mainItems = [
    { label: "Главная", key: "/home" },
    { label: "Контрагенты", key: "/legal_entities" },
    { label: "Договоры", key: "/contracts" },
    { label: "Счета", key: "/bills" },
    { label: "Акты", key: "/acts" },
  ];

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
    ...(!isSuperadmin ? [{ label: "Аккаунт", key: "/account" }] : []),
  ];

  // Объединяем все пункты меню для мобильной версии
  const mobileMenuItems = [...mainItems, ...settingsItems];

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const allItems = isMobile
      ? mobileMenuItems
      : [...mainItems, ...(showSettings ? settingsItems : [])];
    const matchedItem = allItems.find((item) =>
      currentPath.startsWith(item.key)
    );
    return matchedItem ? [matchedItem.key] : [];
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const companyMenuItems = availableCompanies.map((companyId) => {
    const company = companies.find((c) => c.company_id === companyId);
    return {
      key: companyId,
      label: company ? company.company_name : companyId,
      onClick: () => setSelectedCompanyId(companyId),
    };
  });

  const selectedCompanyName =
    companies.find((c) => c.company_id === selectedCompanyId)?.company_name ||
    selectedCompanyId;

  if (isMobile) {
    return (
      <>
        <div className="navbar-container">
          <Button
            className="mobile-menu-button"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
          />

          <div className="buttons-container">
            {!isSuperadmin && (
              <Dropdown
                menu={{ items: companyMenuItems }}
                placement="bottomRight"
              >
                <Button className="company-selector">
                  {selectedCompanyName || "Добавьте компанию"}
                </Button>
              </Dropdown>
            )}

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
            </button>
          </div>
        </div>

        <Drawer
          title="Меню"
          placement="left"
          onClose={toggleDrawer}
          visible={drawerVisible}
          width={280}
        >
          <Menu
            mode="vertical"
            items={mobileMenuItems}
            selectedKeys={getSelectedKeys()}
            onClick={({ key }) => {
              navigate(key);
              toggleDrawer();
            }}
          />
        </Drawer>
      </>
    );
  }

  // Десктопная версия
  return (
    <div className={`navbar-container ${showSettings ? "settings-open" : ""}`}>
      <Menu
        className="navbar-menu"
        mode="horizontal"
        items={mainItems}
        selectedKeys={getSelectedKeys()}
        onClick={({ key }) => navigate(key)}
      />

      {showSettings && (
        <Menu
          className="settings-menu"
          mode="horizontal"
          items={settingsItems}
          selectedKeys={getSelectedKeys()}
          onClick={({ key }) => navigate(key)}
        />
      )}

      <div className="buttons-container">
        {!isSuperadmin && (
          <Dropdown menu={{ items: companyMenuItems }} placement="bottomRight">
            <Button className="company-selector">
              {selectedCompanyName || "Добавьте компанию"}
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
