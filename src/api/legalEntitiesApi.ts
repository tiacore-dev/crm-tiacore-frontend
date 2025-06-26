// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ILegalEntity {
  legal_entity_id: string;
  full_name?: string;
  short_name: string; //[3, 100] characters
  inn: string; //[10, 12] characters
  kpp?: string; // 9 characters  Expand all( string | null)
  opf?: string; // Expand all( string | null)
  ogrn: string; //[13, 15] characters
  vat_rate?: number; // Expand all(integer | null) (0/5/7/20)
  address: string; //[5, 255] characters
  entity_type_id?: string; // Expand all( string | null)
  signer?: string; // Expand all( string | null)
}

export interface IUpdateLegalEntity {
  full_name?: string;
  short_name: string; //[3, 100] characters
  inn: string; //[10, 12] characters
  kpp?: string; // 9 characters Expand all( string | null)
  opf?: string; // Expand all( string | null)
  ogrn: string; //[13, 15] characters
  vat_rate?: number; // Expand all(integer | null) (0/5/7/20)
  address: string; //[5, 255] characters
  entity_type_id?: string; // Expand all( string | null)
  signer?: string; // Expand all( string | null)
}
// Функция для создания нового
interface ICreateLegalEntity {
  full_name?: string;
  short_name: string; //[3, 100] characters
  inn: string; //[10, 12] characters
  kpp?: string; // 9 characters Expand all( string | null)
  opf?: string; // Expand all( string | null)
  ogrn: string; //[13, 15] characters
  vat_rate?: number; // Expand all(integer | null)
  address: string; //[5, 255] characters
  entity_type_id?: string; // Expand all( string | null)
  signer?: string; // Expand all( string | null)
  company_id: string; // Expand all stringuuid4
  relation_type: "buyer" | "seller";
  // description?: string | null;
}

export interface ICreateLegalEntityINN {
  inn: string; //[10, 12] characters
  kpp?: string; // 9 characters Expand all(string | null)
  company_id: string; // Expand allstringuuid4
  relation_type: "buyer" | "seller"; // Expand allstring
  description?: string;
}

export interface IInnKppResponse {
  legal_entity_id: string;
  legal_entity_name?: string;
}

export interface ILegalEtitiesResponse {
  total: number;
  entities: ILegalEntity[];
}

// Функция для получения списка пользователей с параметрами
export const fetchLegalEntities = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.get(`${url}/api/legal-entities/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const fetchLegalEntitiesFiltred = async (company_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { company_id: company_id, page: 1, page_size: 100 };
  const response = await axiosInstance.get(`${url}/api/legal-entities/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createLegalEntity = async (
  newLegalEntity: ICreateLegalEntity
): Promise<ILegalEntity> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.post(
    `${url}/api/legal-entities/add`,
    newLegalEntity,
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

//получение инфопмации
export const fetchLegalEntityDetails = async (legal_entity_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  try {
    const response = await axiosInstance.get(
      `${url}/api/legal-entities/${legal_entity_id}`,
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

//изменить данные

export const updateLegalEntity = async (
  legal_entity_id: string,
  updatedData: IUpdateLegalEntity
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.patch(
    `${url}/api/legal-entities/${legal_entity_id}`,
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

export const deleteLegalEntity = async (legal_entity_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  await axiosInstance.delete(`${url}/api/legal-entities/${legal_entity_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchLegalEntityByInnKpp = async (
  inn: string,
  kpp: string | null = null
): Promise<IInnKppResponse> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: {
    inn: string;
    kpp?: string;
    company_id?: string;
  } = { inn };

  if (kpp) {
    params.kpp = kpp;
  }

  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.get(
    `${url}/api/legal-entities/inn-kpp`,
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

export const fetchSellers = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = { page: 1, page_size: 100 };
  // if (!isSuperadmin && selectedCompanyId) {
  params.company_id = selectedCompanyId;
  // }

  const response = await axiosInstance.get(
    `${url}/api/legal-entities/get-sellers`,
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

export const fetchBuyers = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
  }
  const response = await axiosInstance.get(
    `${url}/api/legal-entities/get-buyers`,
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

export const createLegalEntityByInn = async (
  data: ICreateLegalEntityINN
): Promise<ILegalEntity> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company_id = selectedCompanyId;
    data.company_id = selectedCompanyId;
  }

  const response = await axiosInstance.post(
    `${url}/api/legal-entities/add-by-inn`,
    data,
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
