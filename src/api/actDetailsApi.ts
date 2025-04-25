// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import { IActDetailsResponse } from "../hooks/actDetails/actDetailQuery";

export interface IActDetail {
  act_detail_id: string; //uuid4
  act: string; //uuid4
  service: string; //uuid4
  quantity: number;
  summ: number;
}

// Функция для получения списка с параметрами
export const fetchActDetails = async (params?: { act?: string }) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  // Определяем тип параметров запроса
  interface RequestParams {
    page: number;
    page_size: number;
    act?: string;
    company?: string;
  }

  const requestParams: RequestParams = {
    page: 1,
    page_size: 100,
    ...params,
  };

  // Добавляем company в параметры, если пользователь не суперадмин и companyId есть
  if (!isSuperadmin && selectedCompanyId) {
    requestParams.company = selectedCompanyId;
  }

  const response = await axiosInstance.get<IActDetailsResponse>(
    `${url}/api/act-details/all`,
    {
      params: requestParams,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Функция для создания нового
export const createActDetail = async (newActDetail: {
  act: string; //uuid4
  service: string; //uuid4
  quantity: number;
  summ: number;
}): Promise<IActDetail> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }

  const response = await axiosInstance.post(
    `${url}/api/act-details/add`,
    newActDetail,
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

//изменить данные
export const updateActDetail = async (
  act_detail_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }

  const response = await axiosInstance.patch(
    `${url}/api/act-details/${act_detail_id}`,
    updatedData,
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

//удалить данные

export const deleteActDetail = async (act_detail_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }

  await axiosInstance.delete(`${url}/api/act-details/${act_detail_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
