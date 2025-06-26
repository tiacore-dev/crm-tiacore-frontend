import { useQuery } from "@tanstack/react-query";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
  fetchLegalEntityByInnKpp,
  fetchSellers,
  fetchBuyers,
  ILegalEtitiesResponse,
  IInnKppResponse,
} from "../../api/legalEntitiesApi";
import { useNavigate } from "react-router-dom";

export interface ILegalEntitiesResponse {
  total: number;
  entities: ILegalEntity[];
}

export const useLegalEntityDetailsQuery = (
  legal_entity_id: string,
  options?: { enabled?: boolean }
) => {
  const navigate = useNavigate();

  return useQuery<ILegalEntity>({
    queryKey: ["legalEntityDetails", legal_entity_id],
    queryFn: () => {
      if (!legal_entity_id) {
        return Promise.resolve(null);
      }
      return fetchLegalEntityDetails(legal_entity_id).catch((error) => {
        if (error.response?.status === 404) {
          navigate("/404", { replace: true }); // Ключевое изменение - replace: true
        }
        throw error;
      });
    },
    retry: false,
    enabled: options?.enabled ?? !!legal_entity_id,
    ...options,
  });
};

export const useLegalEntityQuery = () => {
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntities"],
    queryFn: () => fetchLegalEntities(),
    retry: false,
  });
};

export const useLegalEntitiesBuyers = (company_id?: string | null) => {
  let selectedCompanyId = localStorage.getItem("selectedCompanyId");
  if (company_id != null) {
    selectedCompanyId = company_id;
  }
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesBuyers", selectedCompanyId],
    queryFn: () => fetchBuyers(selectedCompanyId),
    retry: false,
  });
};

export const useLegalEntitiesSellers = (selectedCompanyId?: string | null) => {
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesSellers", selectedCompanyId],
    queryFn: () => fetchSellers(selectedCompanyId),
    retry: false,
  });
};

export const useLegalEntityByInnKppQuery = (
  inn: string,
  kpp?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<IInnKppResponse>({
    queryKey: ["legalEntityByInnKpp", inn, kpp],
    queryFn: () => fetchLegalEntityByInnKpp(inn, kpp),
    enabled: options?.enabled ?? !!inn, // Запрос выполняется только если inn указан или явно включен
    retry: false,
    ...options, // Распространяем остальные опции
  });
};

export const useLegalEntitiesForSelection = () => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntitiesForSelection", selectedCompanyId],
    queryFn: () => fetchLegalEntities(selectedCompanyId),
    retry: false,
  });
};
