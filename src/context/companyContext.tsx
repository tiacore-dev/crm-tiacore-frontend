// companyContext.tsx
import { QueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CompanyContextType {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  availableCompanies: string[];
  isSuperadmin: boolean;
  setAvailableCompanies: (companies: string[]) => void;
  currentAppPermissions: string[];
  hasPermission: (permission: string) => boolean;
}

const CompanyContext = createContext<CompanyContextType>({
  selectedCompanyId: null,
  setSelectedCompanyId: () => {},
  availableCompanies: [],
  isSuperadmin: false,
  setAvailableCompanies: () => {},
  currentAppPermissions: [],
  hasPermission: () => false,
});

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    localStorage.getItem("selectedCompanyId")
  );
  const [availableCompanies, setAvailableCompanies] = useState<string[]>(
    JSON.parse(localStorage.getItem("availableCompanies") || "[]")
  );
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [currentAppPermissions, setCurrentAppPermissions] = useState<string[]>(
    []
  );

  const hasPermission = (permission: string) => {
    return isSuperadmin || currentAppPermissions.includes(permission);
  };

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
    const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

    setIsSuperadmin(isSuperadmin);
    const appId = process.env.REACT_APP_ID || "crm_app";
    const appCompanies = permissions[appId] || {};
    const companyIds = Object.keys(appCompanies);

    // Сохраняем компании в localStorage
    localStorage.setItem("availableCompanies", JSON.stringify(companyIds));
    setAvailableCompanies(companyIds);

    if (isSuperadmin) {
      setCurrentAppPermissions([]);
      if (savedCompanyId) {
        setSelectedCompanyId(savedCompanyId);
      } else if (companyIds.length > 0) {
        setSelectedCompanyId(companyIds[0]);
      }
    } else {
      if (savedCompanyId && companyIds.includes(savedCompanyId)) {
        setSelectedCompanyId(savedCompanyId);
        const companyPermissions =
          appCompanies[savedCompanyId]?.[0]?.permissions || [];
        setCurrentAppPermissions(companyPermissions);
      } else if (companyIds.length > 0) {
        setSelectedCompanyId(companyIds[0]);
        const companyPermissions =
          appCompanies[companyIds[0]]?.[0]?.permissions || [];
        setCurrentAppPermissions(companyPermissions);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      localStorage.setItem("selectedCompanyId", selectedCompanyId);
      if (!isSuperadmin) {
        const permissions = JSON.parse(
          localStorage.getItem("permissions") || "{}"
        );
        const appId = process.env.REACT_APP_ID || "crm_app";
        const appCompanies = permissions[appId] || {};
        const companyPermissions =
          appCompanies[selectedCompanyId]?.[0]?.permissions || [];
        setCurrentAppPermissions(companyPermissions);
      }
    }
  }, [selectedCompanyId, isSuperadmin]);

  // Добавляем функцию для обновления availableCompanies с сохранением в localStorage
  const updateAvailableCompanies = (companies: string[]) => {
    localStorage.setItem("availableCompanies", JSON.stringify(companies));
    setAvailableCompanies(companies);
  };

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyId,
        setSelectedCompanyId,
        availableCompanies,
        isSuperadmin,
        setAvailableCompanies: updateAvailableCompanies, // Используем новую функцию
        currentAppPermissions,
        hasPermission,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
export const queryClient = new QueryClient();
