//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";
import { companiesSelector } from "../../redux/slices/companiesSlice";
import { ICompaniesResponse } from "../../pages/legalEntitiesPage/components/legalEntityFormModal";

export interface useCompanyQueryResponse {
  total: number;
  companies: ICompany[];
}

export const useCompanyQuery = () => {
  return useQuery<useCompanyQueryResponse>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });
};

export const useCompanyDetailsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["companyDetails", company_id],
    queryFn: () => fetchCompanyDetails(company_id),
    retry: false,
  });
};

export const useCompaniesForSelection = () => {
  return useQuery<ICompaniesResponse>({
    queryKey: ["companiesForSelection"], //??????
    queryFn: () => fetchCompanies(),
  });
};
