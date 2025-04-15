// src/api/templatesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ITemplate {
  template_id: string;
  template_name: string;
  description: string;
  company: string;
  entity: string;
  s3_key: string;
}

// Функция для получения списка  с параметрами
export const fetchTemplates = async () => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/templates/all`, {
    params: { page: 1, page_size: 100 },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createTemplate = async (
  formData: FormData
): Promise<ITemplate> => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await axiosInstance.post(
      `${url}/api/templates/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при создании шаблона");
    }
    throw error;
  }
};
//получение инфопмации о пользователе
export const fetchTemplateDetails = async (template_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(
      `${url}/api/templates/${template_id}`,
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

//изменить данные пользователя
export const updateTemplate = async (template_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/templates/${template_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//удалить данные пользователя

export const deleteTemplate = async (template_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/templates/${template_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const downloadTemplate = async (template_id: string) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(
      `${url}/api/templates/${template_id}/download`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при загрузке файла");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error; // Пробрасываем ошибку дальше
  }
};

//генерация шаблона
export const generateTemplate = async (
  template_id: string,
  entity_id: string,
  is_pdf: boolean
) => {
  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await axiosInstance.post(
      `${url}/api/templates/generate`,
      { template_id, entity_id, is_pdf },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Указываем, что сервер возвращает бинарные данные
      }
    );

    // Создаем ссылку для скачивания файла
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `generated_template.${is_pdf ? "pdf" : "docx"}`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при генерации шаблона");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error;
  }
};

// export const generateTemplate = async (
//   template_id: string,
//   entity_id: string,
//   is_pdf: boolean
// ): Promise<string> => {
//   const url = process.env.REACT_APP_API_URL;
//   const accessToken = localStorage.getItem("access_token");

//   try {
//     const response = await axiosInstance.post<string>(
//       `${url}/api/templates/generate`,
//       { template_id, entity_id, is_pdf },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError;
//     if (axiosError.response) {
//       toast.error("Ошибка при генерации шаблона");
//     } else {
//       toast.error("Неизвестная ошибка");
//     }
//     throw error;
//   }
// };
