import { useQuery } from "@tanstack/react-query";
import { fetchBillDetails, IBillDetail } from "../../api/billDetailsApi";
import { useCompany } from "../../context/companyContext";

export interface IBillsDetailsQueryParams {
  bill?: string;
}
export interface IBillDetailsResponse {
  total: number;
  bill_details: IBillDetail[];
}

export const useBillDetailsQuery = (billId?: string) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery<IBillDetailsResponse>({
    queryKey: ["billDetails", billId, selectedCompanyId],
    queryFn: () => fetchBillDetails({ bill: billId }, selectedCompanyId),
  });
};
