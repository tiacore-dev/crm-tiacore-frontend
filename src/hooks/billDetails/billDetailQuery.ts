import { useQuery } from "@tanstack/react-query";
import { fetchBillDetails, IBillDetail } from "../../api/billDetailsApi";

export interface IBillsDetailsQueryParams {
  bill?: string;
}
export interface IBillDetailsResponse {
  total: number;
  bill_details: IBillDetail[];
}

export const useBillDetailsQuery = (billId?: string) => {
  return useQuery<IBillDetailsResponse>({
    queryKey: ["billDetails", billId],
    queryFn: () => fetchBillDetails({ bill: billId }), // передаём параметры правильно
  });
};
