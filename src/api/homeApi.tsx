import { axiosInstance } from "../axiosConfig";
import { ILegalEntityType } from "../pages/legalEntitiesPage/components/legalEntityCreateModal";
export interface ILegalEntityTypesResponse {
  total: number;
  legal_entity_types: ILegalEntityType[];
}
export const fetchEntityTypes =
  async (): Promise<ILegalEntityTypesResponse> => {
    const url = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem("access_token");
    const response = await axiosInstance.get(
      `${url}/api/legal-entity-types/all`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response.data);
    return response.data;
  };

export const fetchContractStatuses = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/contract-statuses/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const fetchUserRoles = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/user-roles/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
