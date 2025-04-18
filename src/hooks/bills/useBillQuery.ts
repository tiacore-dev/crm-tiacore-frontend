import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchBill, fetchBills, IBill } from "../../api/billsApi";
import { RootState } from "../../redux/store";

export interface IBillsResponse {
  total: number;
  bills: IBill[];
}

export interface IBillsQueryParams {
  bank_account?: string;
  contract?: string;
  bill_date_to?: number;
  bill_date_from?: number;
  sort_by?: string;
  order?: string;
  page?: number;
  page_size?: number;
}

export const useBillsQuery = (queryParams: IBillsQueryParams) => {
  const {
    bank_account,
    contract,
    bill_date_from,
    bill_date_to,
    page,
    page_size,
    sort_by,
    order,
  } = useSelector((state: RootState) => state.bills);

  // Создаем объект параметров, включая только те, которые имеют значение
  const buildQueryParams = () => {
    const params: IBillsQueryParams = {
      page,
      page_size,
    };

    if (bank_account) params.bank_account = bank_account;
    if (contract) params.contract = contract;
    if (bill_date_from) params.bill_date_from = bill_date_from;
    if (bill_date_to) params.bill_date_to = bill_date_to;
    if (sort_by) params.sort_by = sort_by;
    if (sort_by && order) params.order = order; // order отправляем только если есть sort_by

    return params;
  };

  return useQuery<IBillsResponse>({
    queryKey: ["bills", buildQueryParams()],
    queryFn: () => fetchBills(buildQueryParams()),
  });
};

export const useBillQuery = (bill_id: string) => {
  return useQuery({
    queryKey: ["bill", bill_id],
    queryFn: () => fetchBill(bill_id),
    retry: false,
  });
};
