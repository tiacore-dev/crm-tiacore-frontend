import { useQuery } from "@tanstack/react-query";
// import { useCompany } from "../../context/companyContext";
import { fetchEntityCompanyRelations } from "../../api/entityCompanyRelationsApi";

export interface IEntityCompanyRelationsResponse {
  total: number;
  relations: {
    entity_company_relation_id: string;
    legal_entity_id: string;
    company_id: string;
    relation_type: string;
  }[];
}

// В файле useEntityCompanyRelationsQuery.ts
export const useIsSellerQuery = (
  legal_entity_id?: string | null,
  company?: string | null
) => {
  return useQuery<IEntityCompanyRelationsResponse | null>({
    queryKey: ["isSeller", legal_entity_id, company, "seller"],
    queryFn: async () => {
      if (!legal_entity_id || !company) {
        return null;
      }
      return await fetchEntityCompanyRelations(
        legal_entity_id,
        company,
        "seller"
      );
    },
    retry: false,
    enabled: !!legal_entity_id && !!company,
  });
};
