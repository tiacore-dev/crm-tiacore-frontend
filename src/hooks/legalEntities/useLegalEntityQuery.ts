//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
} from "../../api/legalEntitiesApi";
import { legalEntitiesSelector } from "../../redux/slices/legalEntitiesSlice";

export interface ILegalEntitiesResponse {
  total: number;
  entities: ILegalEntity[];
}

export const useLegalEntityQuery = () => {
  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntities"],
    queryFn: fetchLegalEntities,
  });
};

export const useLegalEntityDetailsQuery = (legal_entity_id: string) => {
  return useQuery({
    queryKey: ["legalEntityDetails", legal_entity_id],
    queryFn: () => fetchLegalEntityDetails(legal_entity_id),
    retry: false,
  });
};

export const useLegalEntitiesForSelection = () => {
  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntitiesForSelection"],
    queryFn: () => fetchLegalEntities(),
  });
};
