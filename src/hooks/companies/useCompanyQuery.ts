//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";
import { useNavigate } from "react-router-dom";

export interface useCompanyQueryResponse {
  total: number;
  companies: ICompany[];
}
export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export const useCompanyQuery = () => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  return useQuery<useCompanyQueryResponse>({
    queryKey: ["companies", selectedCompanyId],
    queryFn: () => fetchCompanies(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};

export const useCompanyDetailsQuery = (company_id: string) => {
  const navigate = useNavigate();
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  return useQuery({
    queryKey: ["companyDetails", company_id, selectedCompanyId],
    queryFn: () => {
      return fetchCompanyDetails(company_id).catch((error) => {
        if (error.response?.status === 404) {
          navigate("/404", { replace: true }); // Перенаправление с заменой в истории
        }
        throw error; // Продолжаем пробрасывать ошибку
      });
    },
    retry: false,
  });
};

export const useCompaniesForSelection = () => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery<ICompaniesResponse>({
    queryKey: ["companiesForSelection", selectedCompanyId], //??????
    queryFn: () => fetchCompanies(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
