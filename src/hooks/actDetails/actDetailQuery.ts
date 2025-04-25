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
  const { selectedCompanyId } = useCompany();
  return useQuery<IActDetailsResponse>({
    queryKey: ["actDetails", actId, selectedCompanyId], // Ключ кэша включает actId
    queryFn: () => fetchActDetails({ act: actId }), // передаём параметры правильно
  });
};
