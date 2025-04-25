// companyContext.tsx
import { QueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
interface CompanyContextType {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  availableCompanies: string[];
  isSuperadmin: boolean; // Добавляем поле isSuperadmin
}

const CompanyContext = createContext<CompanyContextType>({
  selectedCompanyId: null,
  setSelectedCompanyId: () => {},
  availableCompanies: [],
  isSuperadmin: false, // Значение по умолчанию
});

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
    const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

    setIsSuperadmin(isSuperadmin);

    const companies = Object.keys(permissions);
    setAvailableCompanies(companies);

    if (!isSuperadmin) {
      if (savedCompanyId && companies.includes(savedCompanyId)) {
        setSelectedCompanyId(savedCompanyId);
      } else if (companies.length > 0) {
        setSelectedCompanyId(companies[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      localStorage.setItem("selectedCompanyId", selectedCompanyId);
    }
  }, [selectedCompanyId]);

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyId,
        setSelectedCompanyId,
        availableCompanies,
        isSuperadmin,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
export const queryClient = new QueryClient();
