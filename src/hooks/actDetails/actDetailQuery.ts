import { useQuery } from "@tanstack/react-query";
import { fetchActDetails, IActDetail } from "../../api/actDetailsApi";
import { useCompany } from "../../context/companyContext";

export interface IActDetailsQueryParams {
  act?: string;
}

export interface IActDetailsResponse {
  total: number;
  act_details: IActDetail[];
}

export const useActDetailsQuery = (actId?: string) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery<IActDetailsResponse>({
    queryKey: ["actDetails", actId, selectedCompanyId],
    queryFn: () => fetchActDetails({ act: actId }, selectedCompanyId),
  });
};
