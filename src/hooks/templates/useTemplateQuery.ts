//UsetemplateQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchTemplates,
  fetchTemplateDetails,
  ITemplate,
} from "../../api/templatesApi";

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

export const useTemplateQuery = () => {
  return useQuery<ITemplatesResponse>({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });
};

export const useTemplateDetailsQuery = (template_id: string) => {
  return useQuery<ITemplate>({
    queryKey: ["templateDetails", template_id],
    queryFn: () => fetchTemplateDetails(template_id),
    enabled: !!template_id, //??
  });
};
