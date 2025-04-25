//UsetemplateQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchTemplates,
  fetchTemplateDetails,
  ITemplate,
} from "../../api/templatesApi";
import { useCompany } from "../../context/companyContext";

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
  const { selectedCompanyId } = useCompany();
  return useQuery<ITemplatesResponse>({
    queryKey: ["templates", params, selectedCompanyId], // Добавляем параметры в ключ запроса
    queryFn: () => fetchTemplates(params), // Передаем параметры в fetchTemplates
  });
};

export const useTemplateDetailsQuery = (template_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ITemplate>({
    queryKey: ["templateDetails", template_id, selectedCompanyId],
    queryFn: () => fetchTemplateDetails(template_id),
    enabled: !!template_id,
  });
};
