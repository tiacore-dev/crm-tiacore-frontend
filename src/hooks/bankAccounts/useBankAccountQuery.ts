//bankAccountsUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchBankAccounts,
  fetchBankAccountDetails,
  IBankAccount,
} from "../../api/bankAccountsApi";
import { bankAccountsSelector } from "../../redux/slices/bankAccountsSlice";

export interface IBankAccountsResponse {
  total: number;
  bank_accounts: IBankAccount[];
}

export const useBankAccountQuery = () => {
  return useQuery<IBankAccountsResponse>({
    queryKey: ["bank_accounts"],
    queryFn: fetchBankAccounts,
  });
};

export const useBankcAccountDetailsQuery = (bank_account_id: string) => {
  return useQuery({
    queryKey: ["bankAccountDetails", bank_account_id],
    queryFn: () => fetchBankAccountDetails(bank_account_id),
    retry: false,
  });
};

export const useBankAccountsForSelection = () => {
  return useQuery<IBankAccountsResponse>({
    queryKey: ["bankAccountsForSelection"],
    queryFn: () => fetchBankAccounts(),
  });
};
