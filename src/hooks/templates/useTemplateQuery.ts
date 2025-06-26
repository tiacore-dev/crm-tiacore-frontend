//UsetemplateQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchTemplates,
  fetchTemplateDetails,
  ITemplate,
} from "../../api/templatesApi";
import { useCompany } from "../../context/companyContext";
import { useNavigate } from "react-router-dom";

export interface ITemplatesResponse {
  total: number;
  templates: {
    template_id: string;
    template_name: string;
    description: string;
    company: string;
    entity: string;
    s3_key: string;
  }[];
}

export interface ITemplatesQueryParams {
  entity?: string;
  page?: number;
  page_size?: number;
}

export const useTemplateQuery = (params?: ITemplatesQueryParams) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  return useQuery<ITemplatesResponse>({
    queryKey: ["templates", params, selectedCompanyId], // Добавляем параметры в ключ запроса
    queryFn: () => fetchTemplates(params, selectedCompanyId), // Передаем параметры в fetchTemplates
  });
};

export const useTemplateDetailsQuery = (template_id: string) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const navigate = useNavigate();

  return useQuery<ITemplate>({
    queryKey: ["templateDetails", template_id, selectedCompanyId],
    queryFn: () => {
      if (!template_id) {
        return Promise.resolve(null);
      }
      return fetchTemplateDetails(template_id, selectedCompanyId).catch(
        (error) => {
          if (error.response?.status === 404) {
            navigate("/404", { replace: true }); // Перенаправление с заменой в истории
          }
          throw error; // Продолжаем пробрасывать ошибку
        }
      );
    },
    enabled: !!template_id,
  });
};
