//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchTemplates,
  fetchTemplateDetails,
  ITemplate,
} from "../../api/templatesApi";
import { templatesSelector } from "../../redux/slices/templatesSlice";

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
  const { company, search, page, page_size } = useSelector(templatesSelector);
  return useQuery<ITemplatesResponse>({
    queryKey: ["templates", company, search, page, page_size],
    queryFn: () => fetchTemplates(company, search, page, page_size),
  });
};

export const useTemplateDetailsQuery = (template_id: string) => {
  return useQuery<ITemplate>({
    queryKey: ["templateDetails", template_id],
    queryFn: () => fetchTemplateDetails(template_id),
    // retry: false,
    enabled: !!template_id,//??
  });
};
