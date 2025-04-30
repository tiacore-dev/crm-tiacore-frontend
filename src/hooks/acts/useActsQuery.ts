import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchActs, fetchAct, IAct } from "../../api/actsApi";
import { actsSelector } from "../../redux/slices/actsSlice";
import { RootState } from "../../redux/store";
import { useCompany } from "../../context/companyContext";

export interface IActsResponse {
  total: number;
  acts: IAct[];
}

export interface IActsQueryParams {
  contract?: string;
  act_date_to?: number;
  act_date_from?: number;
  sort_by?: string;
  order?: string;
  page: number;
  page_size: number;
}

export const useActsQuery = (queryParams: IActsQueryParams) => {
  const {
    contract,
    act_date_from,
    act_date_to,
    page,
    page_size,
    sort_by,
    order,
  } = useSelector((state: RootState) => state.acts);

  const buildQueryParams = () => {
    const params: IActsQueryParams = {
      page,
      page_size,
    };

    if (contract) params.contract = contract;
    if (act_date_from) params.act_date_from = act_date_from;
    if (act_date_to) params.act_date_to = act_date_to;
    if (sort_by) params.sort_by = sort_by;
    if (sort_by && order) params.order = order; // order отправляем только если есть sort_by

    return params;
  };
  const { selectedCompanyId } = useCompany();

  return useQuery<IActsResponse>({
    queryKey: ["acts", buildQueryParams(), selectedCompanyId],
    queryFn: () => fetchActs(buildQueryParams(), selectedCompanyId),
  });
};

export const useActQuery = (act_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery({
    queryKey: ["act", act_id, selectedCompanyId],
    queryFn: () => fetchAct(act_id, selectedCompanyId),
    retry: false,
  });
};
