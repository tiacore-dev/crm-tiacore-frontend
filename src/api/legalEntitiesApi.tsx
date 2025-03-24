// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ILegalEntity {
  legal_entity_id: string;
  legal_entity_name: string;
  inn: string;
  kpp: string;
  vat_rate: number;
  address: string;
  entity_type: string;
  signer: string;
  company: string;
  description: string;
}

// Функция для получения списка пользователей с параметрами
export const fetchLegalEntities = async (
  sort_by: string,
  order: string,
  page: number,
  page_size: number
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/legal-entities/all`, {
    params: {
      sort_by,
      order,
      page,
      page_size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для создания нового
export const createLegalEntity = async (newLegalEntity: {
  legal_entity_name: string;
  inn: string;
  kpp: string;
  vat_rate: number;
  address: string;
  entity_type: string;
  signer: string;
  company: string;
  description: string;
}): Promise<ILegalEntity> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/legal-entities/add`,
    newLegalEntity,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//получение инфопмации
export const fetchLegalEntityDetails = async (legal_entity_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(
      `${url}/api/legal-entities/${legal_entity_id}`,
      {
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
      toast.error("Ошибка при загрузке страницы");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error; // Пробрасываем ошибку дальше
  }
};

//изменить данные
export const updateLegalEntity = async (
  legal_entity_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/legal_entities/${legal_entity_id}`,
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

export const deleteLegalEntity = async (legal_entity_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/legal_entities/${legal_entity_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
