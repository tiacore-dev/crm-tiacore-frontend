//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchContracts,
  fetchContractDetails,
  IContract,
} from "../../api/contractsApi";
import { RootState } from "../../redux/store";
import { useCompany } from "../../context/companyContext";

export interface IContractsResponse {
  total: number;
  contracts: IContract[];
}

export interface IContractsQueryParams {
  buyer?: string;
  seller?: string;
  status?: string;
  contract_date_to?: number;
  contract_date_from?: number;
  sort_by?: string;
  order?: string;
  page: number;
  page_size: number;
}

export const useContractQuery = (queryParams: IContractsQueryParams) => {
  const {
    seller,
    buyer,
    status,
    contract_date_to,
    contract_date_from,
    sort_by,
    order,
    page,
    page_size,
  } = useSelector((state: RootState) => state.contracts);

  const buildQueryParams = () => {
    const params: IContractsQueryParams = {
      page,
      page_size,
    };

    if (seller) params.seller = seller;
    if (buyer) params.buyer = buyer;
    if (status) params.status = status;
    if (contract_date_to) params.contract_date_to = contract_date_to;
    if (contract_date_from) params.contract_date_from = contract_date_from;
    if (sort_by) params.sort_by = sort_by;
    if (sort_by && order) params.order = order; // order отправляем только если есть sort_by

    return params;
  };
  const { selectedCompanyId } = useCompany();

  return useQuery<IContractsResponse>({
    queryKey: ["contracts", buildQueryParams(), selectedCompanyId],
    queryFn: () => fetchContracts(buildQueryParams(), selectedCompanyId),
  });
};

export const useContractDetailsQuery = (contract_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery({
    queryKey: ["contractDetails", contract_id, selectedCompanyId],
    queryFn: () => fetchContractDetails(contract_id, selectedCompanyId),
    retry: false,
  });
};

export const useContractsForSelection = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<IContractsResponse>({
    queryKey: ["contractsForSelection", selectedCompanyId],
    queryFn: () =>
      fetchContracts({ page: 1, page_size: 100 }, selectedCompanyId),
  });
};
