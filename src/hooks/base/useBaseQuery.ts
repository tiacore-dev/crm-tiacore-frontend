import {
  ILegalEntityTypesResponse,
  IContractStatusesResponse,
  IUserRolesResponse,
} from "../../api/baseApi";
import {
  fetchEntityTypes,
  fetchContractStatuses,
  fetchUserRoles,
} from "../../api/baseApi";
import { useQuery } from "@tanstack/react-query";

export const useEntityTypes = () => {
  return useQuery<ILegalEntityTypesResponse>({
    queryKey: ["entityTypes"],
    queryFn: fetchEntityTypes,
  });
};

export const useContractStatuses = () => {
  return useQuery<IContractStatusesResponse>({
    queryKey: ["contractStatuses"],
    queryFn: fetchContractStatuses,
  });
};
