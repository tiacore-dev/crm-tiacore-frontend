import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchBill, fetchBills, IBill } from "../../api/billsApi";
import { billsSelector } from "../../redux/slices/billsSlice";

export interface IBillsResponse {
  total: number;
  bills: IBill[];
}

export const useBillsQuery = () => {
  const { bank_account, contract, page, page_size } =
    useSelector(billsSelector);
  return useQuery<IBillsResponse>({
    queryKey: ["bills", bank_account, contract, page, page_size],
    queryFn: () => fetchBills(bank_account, contract, page, page_size),
  });
};

export const useBillQuery = (bill_id: string) => {
  return useQuery({
    queryKey: ["bill", bill_id],
    queryFn: () => fetchBill(bill_id),
    retry: false,
  });
};
