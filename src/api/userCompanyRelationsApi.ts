// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import { IUserCompanyRelationsResponse } from "../hooks/userCompanyRelations/useUserCompanyRelationsQuery";

export interface IUserCompanyRelation {
  user_company_id: string;
  user_id: string;
  company_id: string;
  role_id: string;
}

// Функция для получения списка с параметрами
export const fetchUserCompanyRelations = async (params: {
  user?: string;
  company?: string;
}) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get<IUserCompanyRelationsResponse>(
    `${url}/api/user-company-relations/all`,
    {
      params: {
        ...params,
        page: 1,
        page_size: 100,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Функция для создания нового
export const createUserCompanyRelation = async (newUserCompanyRelation: {
  user: string;
  company: string;
  role: string;
}): Promise<IUserCompanyRelation> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/user-company-relations/add`,
    newUserCompanyRelation,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//изменить данные
export const updateUserCompanyRelation = async (
  user_company_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/user-company-relations/${user_company_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//удалить данные

export const deleteUserCompanyRelation = async (user_company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(
    `${url}/api/user-company-relations/${user_company_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
