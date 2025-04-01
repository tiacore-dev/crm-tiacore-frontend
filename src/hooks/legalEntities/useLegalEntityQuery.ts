//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
} from "../../api/legalEntitiesApi";
import { legalEntitiesSelector } from "../../redux/slices/legalEntitiesSlice";

// interface ILegalEntitiesResponse {
//   total: number;
//   companies: ILegalEntity[];
// }
export interface ILegalEntitiesResponse {
  total: number;
  entities: {
    legal_entity_id: string;
    legal_entity_name: string;
    inn: string;
    kpp: string;
    vat_rate: number;
    address: string;
    entity_type: string;
    signer: string;
    company: string;
    description: string;
  }[];
}

export const useLegalEntityQuery = () => {
  const { currentPage, pageSize, searchCompany, searchEntityType } =
    useSelector(legalEntitiesSelector);
  return useQuery<ILegalEntitiesResponse>({
    queryKey: [
      "legalEntities",
      currentPage,
      pageSize,
      searchCompany,
      searchEntityType,
    ],
    queryFn: () =>
      fetchLegalEntities(
        currentPage,
        pageSize,
        searchCompany,
        searchEntityType
      ),
  });
};

export const useLegalEntityDetailsQuery = (legal_entity_id: string) => {
  return useQuery({
    queryKey: ["legalEntityDetails", legal_entity_id],
    queryFn: () => fetchLegalEntityDetails(legal_entity_id),
    retry: false,
  });
};
