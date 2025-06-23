// src/api/companiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ICompany {
  company_id: string;
  company_name: string;
  description?: string;
  application_id?: string;
}

// Вспомогательная функция для проверки роли и получения company_id

export const fetchCompanies = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.get(`${url}/api/companies/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createCompany = async (newCompany: {
  company_name: string;
  description?: string;
}): Promise<ICompany> => {
  const url = process.env.REACT_APP_API_URL;
  const application_id = process.env.REACT_APP_ID;
  const accessToken = localStorage.getItem("access_token");

  // Создаем объект с данными для отправки, включая application_id
  const requestData = {
    ...newCompany,
    application_id: application_id,
  };

  const response = await axiosInstance.post(
    `${url}/api/companies/add`,
    requestData, // Используем новый объект с application_id
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const fetchCompanyDetails = async (company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(
      `${url}/api/companies/${company_id}`,
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
    throw error;
  }
};

export const updateCompany = async (company_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/companies/${company_id}`,
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

export const deleteCompany = async (company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  await axiosInstance.delete(`${url}/api/companies/${company_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
