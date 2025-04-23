import { useQuery } from "@tanstack/react-query";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
  fetchLegalEntityByInnKpp,
  IInnKppResponse,
} from "../../api/legalEntitiesApi";

export interface ILegalEntitiesResponse {
  total: number;
  entities: ILegalEntity[];
}

export const useLegalEntityByInnKppQuery = (
  inn: string,
  kpp: string | null = null
) => {
  return useQuery<IInnKppResponse>({
    queryKey: ["legalEntityByInnKpp", inn, kpp],
    queryFn: () => fetchLegalEntityByInnKpp(inn, kpp),
    enabled: !!inn, // Запрос выполняется только если inn указан
    retry: false,
    staleTime: 5 * 60 * 1000, //???
  });
};

export const useLegalEntityQuery = () => {
  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntities"],
    queryFn: fetchLegalEntities,
    retry: false,
  });
};

export const useLegalEntityDetailsQuery = (legal_entity_id: string) => {
  return useQuery({
    queryKey: ["legalEntityDetails", legal_entity_id],
    queryFn: () => {
      if (!legal_entity_id) {
        return Promise.resolve(null); // Возвращаем null если ID пустой
      }
      return fetchLegalEntityDetails(legal_entity_id);
    },
    retry: false,
    enabled: !!legal_entity_id, // Запрос выполняется только если legal_entity_id указан
  });
};

export const useLegalEntitiesForSelection = () => {
  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntitiesForSelection"],
    queryFn: () => fetchLegalEntities(),
    retry: false,
  });
};
