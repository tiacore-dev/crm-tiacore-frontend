import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";
import { companiesSelector } from "../../redux/slices/companiesSlice";

interface useCompanyQueryResponse {
  companies: ICompany[];
  total: number;
}

export const useCompanyQuery = () => {
  const { search, sortBy, order, currentPage, pageSize } =
    useSelector(companiesSelector);
  return useQuery<useCompanyQueryResponse>({
    queryKey: ["companies", search, sortBy, order, currentPage, pageSize],
    queryFn: () => fetchCompanies(search, sortBy, order, currentPage, pageSize),
  });
};

export const useCompanyDetailsQuery = (company_id: string) => {
  return useQuery({
    queryKey: ["companyDetails", company_id],
    queryFn: () => fetchCompanyDetails(company_id),
    retry: false,
  });
};
