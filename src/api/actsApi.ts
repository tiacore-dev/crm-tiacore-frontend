// src/api/bankAccountsApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IActsQueryParams } from "../hooks/acts/useActsQuery";

export interface IAct {
  act_id: string;
  act_number: string;
  act_date: number;
  contract?: string;
  buyer: string;
  seller: string;
}

// Функция для получения списка пользователей с параметрами
export const fetchActs = async (queryParams: IActsQueryParams) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  // Создаем копию параметров, удаляя undefined значения
  // const params = Object.fromEntries(
  //   Object.entries(queryParams).filter(([_, value]) => value !== undefined)
  // );
  const params = {
    ...Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    ),
    ...(!isSuperadmin && selectedCompanyId
      ? { company: selectedCompanyId }
      : {}),
  };

  const response = await axiosInstance.get(`${url}/api/acts/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для создания нового
export const createAct = async (newAct: {
  act_number: string;
  act_date: number;
  contract?: string;
  buyer: string;
  seller: string;
}): Promise<IAct> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.post(`${url}/api/acts/add`, newAct, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

//получение инфопмации
export const fetchAct = async (act_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  try {
    const response = await axiosInstance.get(`${url}/api/acts/${act_id}`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при загрузке страницы");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error; // Пробрасываем ошибку дальше
  }
};

//изменить данные
export const updateAct = async (act_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.patch(
    `${url}/api/acts/${act_id}`,
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

export const deleteAct = async (act_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  await axiosInstance.delete(`${url}/api/acts/${act_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
