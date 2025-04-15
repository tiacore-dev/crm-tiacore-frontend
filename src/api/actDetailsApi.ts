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

  const response = await axiosInstance.get<IActDetailsResponse>(
    `${url}/api/act-details/all`,
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
export const createActDetail = async (newActDetail: {
  act: string; //uuid4
  service: string; //uuid4
  quantity: number;
  summ: number;
}): Promise<IActDetail> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/act-details/add`,
    newActDetail,
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
export const updateActDetail = async (
  act_detail_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/act-details/${act_detail_id}`,
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

export const deleteActDetail = async (act_detail_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/act-details/${act_detail_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
