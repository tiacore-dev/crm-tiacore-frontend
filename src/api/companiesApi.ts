// src/api/companiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ICompany {
  company_id: string;
  company_name: string;
  description?: string;
}

// Вспомогательная функция для проверки роли и получения company_id
const getCompanyParam = () => {
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  if (!isSuperadmin) {
    return localStorage.getItem("selectedCompanyId") || undefined;
  }
  return undefined;
};
export const fetchCompanies = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const companyParam = getCompanyParam();

  const params: Record<string, any> = { page: 1, page_size: 100 };
  if (companyParam) {
    params.company = companyParam;
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
  const accessToken = localStorage.getItem("access_token");
  const companyParam = getCompanyParam();

  const data = companyParam
    ? { ...newCompany, company: companyParam }
    : newCompany;

  const response = await axiosInstance.post(`${url}/api/companies/add`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const fetchCompanyDetails = async (company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const companyParam = getCompanyParam();

  try {
    const params: Record<string, any> = {};
    if (companyParam) {
      params.company = companyParam;
    }

    const response = await axiosInstance.get(
      `${url}/api/companies/${company_id}`,
      {
        params,
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
  const companyParam = getCompanyParam();

  const data = companyParam
    ? { ...updatedData, company: companyParam }
    : updatedData;

  const response = await axiosInstance.patch(
    `${url}/api/companies/${company_id}`,
    data,
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
  const companyParam = getCompanyParam();

  const params: Record<string, any> = {};
  if (companyParam) {
    params.company = companyParam;
  }

  await axiosInstance.delete(`${url}/api/companies/${company_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
