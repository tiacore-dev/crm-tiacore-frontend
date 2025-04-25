//bankAccountsUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchBankAccounts,
  fetchBankAccountDetails,
  IBankAccount,
} from "../../api/bankAccountsApi";
import { useCompany } from "../../context/companyContext";

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
  const { selectedCompanyId } = useCompany();
  return useQuery<IBankAccountsResponse>({
    queryKey: ["bank_accounts", params, selectedCompanyId], // Добавляем параметры в ключ запроса
    queryFn: () => fetchBankAccounts(params), // Передаем параметры в fetchBankAccounts
  });
};

export const useBankcAccountDetailsQuery = (bank_account_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery({
    queryKey: ["bankAccountDetails", bank_account_id, selectedCompanyId],
    queryFn: () => fetchBankAccountDetails(bank_account_id),
    retry: false,
  });
};

export const useBankAccountsForSelection = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<IBankAccountsResponse>({
    queryKey: ["bankAccountsForSelection", selectedCompanyId],
    queryFn: () => fetchBankAccounts(),
  });
};
