//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchContracts,
  fetchContractDetails,
  IContract,
} from "../../api/contractsApi";
import { contractsSelector } from "../../redux/slices/contractsSlise";

export interface IContractsResponse {
  total: number;
  contracts: {
    contract_id: string;
    contract_name: string;
    contract_date: number;
    buyer: string;
    seller: string;
    file: string;
    status: string;
  }[];
}

export const useContractQuery = () => {
  const { buyer, seller, status, page, page_size } =
    useSelector(contractsSelector);
  return useQuery<IContractsResponse>({
    queryKey: ["contracts", buyer, seller, status, page, page_size],
    queryFn: () => fetchContracts(buyer, seller, status, page, page_size),
  });
};

export const useContractDetailsQuery = (contract_id: string) => {
  return useQuery({
    queryKey: ["contractDetails", contract_id],
    queryFn: () => fetchContractDetails(contract_id),
    retry: false,
  });
};

export const useContractsForSelection = () => {
  return useQuery<IContractsResponse>({
    queryKey: ["contractsForSelection"],
    queryFn: () => fetchContracts(undefined, undefined, undefined, 1, 100),
  });
};
