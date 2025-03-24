//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
} from "../../api/legalEntitiesApi";
import { legalEntitiesSelector } from "../../redux/slices/legalEntitiesSlice";

interface useLegalEntityQueryResponse {
  companies: ILegalEntity[];
  total: number;
}

export const useLegalEntityQuery = () => {
  const { sortBy, order, currentPage, pageSize, filters } = useSelector(
    legalEntitiesSelector
  );
  return useQuery<useLegalEntityQueryResponse>({
    queryKey: ["legalEntities", sortBy, order, currentPage, pageSize],
    queryFn: () => fetchLegalEntities(sortBy, order, currentPage, pageSize),
  });
};

export const useLegalEntityDetailsQuery = (legal_entity_id: string) => {
  return useQuery({
    queryKey: ["legalEntityDetails", legal_entity_id],
    queryFn: () => fetchLegalEntityDetails(legal_entity_id),
    retry: false,
  });
};
