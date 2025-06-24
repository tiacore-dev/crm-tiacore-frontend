//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";

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
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery({
    queryKey: ["companyDetails", company_id, selectedCompanyId],
    queryFn: () => fetchCompanyDetails(company_id),
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
