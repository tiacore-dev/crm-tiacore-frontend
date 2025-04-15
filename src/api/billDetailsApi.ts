// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import { IBillDetailsResponse } from "../hooks/billDetails/billDetailQuery";

export interface IBillDetail {
  bill_detail_id: string; //uuid4
  bill: string; //uuid4
  service: string; //uuid4
  quantity: number;
  summ: number;
}

// Функция для получения списка с параметрами
export const fetchBillDetails = async (params?: { bill?: string }) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get<IBillDetailsResponse>(
    `${url}/api/bill-details/all`,
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
export const createBillDetail = async (newBillDetail: {
  bill: string; //uuid4
  service: string; //uuid4
  quantity: number;
  summ: number;
}): Promise<IBillDetail> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/bill-details/add`,
    newBillDetail,
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
export const updateBillDetail = async (
  bill_detail_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/bill-details/${bill_detail_id}`,
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

export const deleteBillDetail = async (bill_detail_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/bill-details/${bill_detail_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
