import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface IEntityCompanyRelation {
  entity_company_relation_id: string;
  legal_entity_id: string;
  company_id: string;
  relation_type: string;
}

export const createEntityCompanyRelation = async (newEntityCompanyRelation: {
  legal_entity: string;
  company: string;
  relation_type: string;
}): Promise<IEntityCompanyRelation> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.post(
    `${url}/api/entity-company-relations/add`,
    newEntityCompanyRelation,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const fetchEntityCompanyRelations = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }

  const response = await axiosInstance.get<IEntityCompanyRelation>(
    `${url}/api/entity-company-relations/all`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
