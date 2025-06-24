import { useQuery } from "@tanstack/react-query";
import {
  fetchBankAccounts,
  fetchBankAccountDetails,
  IBankAccount,
} from "../../api/bankAccountsApi";
// import { useCompany } from "../../context/companyContext";

export interface IBankAccountsResponse {
  total: number;
  bank_accounts: IBankAccount[];
}

export interface IBankAccountsQueryParams {
  legal_entity?: string;
  page?: number;
  page_size?: number;
}

export const useBankAccountQuery = (params?: IBankAccountsQueryParams) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery<IBankAccountsResponse>({
    queryKey: ["bank_accounts", params, selectedCompanyId],
    queryFn: () => fetchBankAccounts(params, selectedCompanyId),
  });
};

export const useBankcAccountDetailsQuery = (bank_account_id: string) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery({
    queryKey: ["bankAccountDetails", bank_account_id, selectedCompanyId],
    queryFn: () => fetchBankAccountDetails(bank_account_id, selectedCompanyId),
    retry: false,
  });
};

export const useBankAccountsForSelection = () => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery<IBankAccountsResponse>({
    queryKey: ["bankAccountsForSelection", selectedCompanyId],
    queryFn: () => fetchBankAccounts({}, selectedCompanyId),
  });
};
