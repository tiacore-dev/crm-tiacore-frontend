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
}

const CompanyContext = createContext<CompanyContextType>({
  selectedCompanyId: null,
  setSelectedCompanyId: () => {},
  availableCompanies: [],
  isSuperadmin: false,
  setAvailableCompanies: () => {},
  currentAppPermissions: [],
});

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [currentAppPermissions, setCurrentAppPermissions] = useState<string[]>(
    []
  );

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
    const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

    setIsSuperadmin(isSuperadmin);

    // Получаем application_id из .env
    const appId = process.env.REACT_APP_ID || "crm_app";

    // Получаем компании для текущего приложения
    const appCompanies = permissions[appId] || {};
    const companyIds = Object.keys(appCompanies);

    setAvailableCompanies(companyIds);

    if (!isSuperadmin) {
      if (savedCompanyId && companyIds.includes(savedCompanyId)) {
        setSelectedCompanyId(savedCompanyId);
        // Устанавливаем permissions для выбранной компании
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

      // Обновляем permissions при изменении выбранной компании
      const permissions = JSON.parse(
        localStorage.getItem("permissions") || "{}"
      );
      const appId = process.env.REACT_APP_ID || "crm_app";
      const appCompanies = permissions[appId] || {};
      const companyPermissions =
        appCompanies[selectedCompanyId]?.[0]?.permissions || [];
      setCurrentAppPermissions(companyPermissions);
    }
  }, [selectedCompanyId]);

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyId,
        setSelectedCompanyId,
        availableCompanies,
        isSuperadmin,
        setAvailableCompanies,
        currentAppPermissions,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
export const queryClient = new QueryClient();
