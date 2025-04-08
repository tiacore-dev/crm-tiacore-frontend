import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchActs, fetchAct, IAct } from "../../api/actsApi";
import { actsSelector } from "../../redux/slices/actsSlice";

export interface IActsResponse {
  total: number;
  acts: IAct[];
}

export const useActsQuery = () => {
  const { contract, page, page_size } = useSelector(actsSelector);
  return useQuery<IActsResponse>({
    queryKey: ["acts", contract, page, page_size],
    queryFn: () => fetchActs(contract, page, page_size),
  });
};

export const useActQuery = (act_id: string) => {
  return useQuery({
    queryKey: ["act", act_id],
    queryFn: () => fetchAct(act_id),
    retry: false,
  });
};
