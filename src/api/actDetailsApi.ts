// src/api/legalEntitiesApi.tsx
import { AxiosError } from "axios";
import { axiosInstance } from "../axiosConfig";
import { IActDetailsResponse } from "../hooks/actDetails/actDetailQuery";
import toast from "react-hot-toast";

export interface IActDetail {
  act_detail_id: string; //uuid4
  act: string; //uuid4
  service: string; //uuid4
  quantity: number;
  summ: number;
}

// Функция для получения списка с параметрами
export const fetchActDetails = async (
  params?: { act?: string },
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

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
    ...(!isSuperadmin && selectedCompanyId
      ? { company: selectedCompanyId }
      : {}),
  };

  try {
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
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при загрузке данных");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error;
  }
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
