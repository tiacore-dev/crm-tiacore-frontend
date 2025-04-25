import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchUserCompanyRelations,
  IUserCompanyRelation,
} from "../../api/userCompanyRelationsApi";
import { useCompany } from "../../context/companyContext";

export interface IUserCompanyRelationsQueryParams {
  user?: string;
  company?: string;
}

export interface IUserCompanyRelationsResponse {
  total: number;
  relations: IUserCompanyRelation[];
}

export const useUserRelationsQuery = (
  userId?: string,
  options?: UseQueryOptions<IUserCompanyRelationsResponse>
) => {
  const { selectedCompanyId } = useCompany();

  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["userRelations", userId, selectedCompanyId],
    queryFn: () => fetchUserCompanyRelations({ user: userId }),
    enabled: !!userId,
    ...options,
  });
};

export const useCompanyRelationsQuery = (
  companyId?: string,
  options?: UseQueryOptions<IUserCompanyRelationsResponse>
) => {
  const { selectedCompanyId } = useCompany();

  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["companyRelations", companyId, selectedCompanyId],
    queryFn: () => fetchUserCompanyRelations({ company: companyId }),
    enabled: !!companyId,
    ...options,
  });
};
