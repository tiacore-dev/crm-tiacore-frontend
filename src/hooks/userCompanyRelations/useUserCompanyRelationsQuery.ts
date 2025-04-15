import { useQuery } from "@tanstack/react-query";
import {
  fetchUserCompanyRelations,
  IUserCompanyRelation,
} from "../../api/userCompanyRelationsApi";

export interface IUserCompanyRelationsQueryParams {
  user?: string;
  company?: string;
}

export interface IUserCompanyRelationsResponse {
  total: number;
  relations: IUserCompanyRelation[];
}

export const useUserCompanyRelationsDetailsQuery = (
  userId?: string,
  companyId?: string
) => {
  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["userCompanyRelationsDetails", userId, companyId], // Ключ кэша включает actId
    queryFn: () =>
      fetchUserCompanyRelations({ user: userId, company: companyId }), // передаём параметры правильно
  });
};
