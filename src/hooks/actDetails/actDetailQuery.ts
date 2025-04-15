import { useQuery } from "@tanstack/react-query";
import { fetchActDetails, IActDetail } from "../../api/actDetailsApi";

export interface IActDetailsQueryParams {
  act?: string;
}

export interface IActDetailsResponse {
  total: number;
  act_details: IActDetail[];
}

export const useActDetailsQuery = (actId?: string) => {
  return useQuery<IActDetailsResponse>({
    queryKey: ["actDetails", actId], // Ключ кэша включает actId
    queryFn: () => fetchActDetails({ act: actId }), // передаём параметры правильно
  });
};
