//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBillDetails, IBillDetail } from "../../api/billDetailsApi";

export interface IBillDetailResponse {
  total: number;
  bill_details: IBillDetail[];
}

export const useBillDetailsQuery = () => {
  return useQuery<IBillDetailResponse>({
    queryKey: ["billDetails"],
    queryFn: fetchBillDetails,
  });
};
