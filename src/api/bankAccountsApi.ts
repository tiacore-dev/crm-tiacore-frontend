// src/api/bankAccountsApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface IBankAccount {
  bank_account_id: string;
  legal_entity: string;
  bank_name: string;
  account_number: string;
  bank_bic: string;
  bank_corr_account: string;
}

// Функция для получения списка пользователей с параметрами
export const fetchBankAccounts = async (params?: {
  legal_entity?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  // Устанавливаем параметры по умолчанию
  const queryParams = {
    page: params?.page || 1,
    page_size: params?.page_size || 100,
    ...(params?.legal_entity && { legal_entity: params.legal_entity }), // Добавляем legal_entity только если он передан
  };

  const response = await axiosInstance.get(`${url}/api/bank-accounts/all`, {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для создания нового
export const createBankAccount = async (newBankAccount: {
  account_number: string;
  bank_name: string;
  bank_bic: string;
  bank_corr_account: string;
  legal_entity: string;
}): Promise<IBankAccount> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/bank-accounts/add`,
    newBankAccount,
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
export const fetchBankAccountDetails = async (bank_account_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(
      `${url}/api/bank-accounts/${bank_account_id}`,
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
export const updateBankAccount = async (
  bank_account_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/bank-accounts/${bank_account_id}`,
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

export const deleteBankAccount = async (bank_account_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/bank-accounts/${bank_account_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
