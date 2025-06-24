//useservicequery
import { useQuery } from "@tanstack/react-query";
import {
  fetchServiceDetails,
  fetchServices,
  IService,
} from "../../api/servicesApi";
// import { useCompany } from "../../context/companyContext";

interface IServicesResponse {
  total: number;
  services: IService[];
}

export const useServiceQuery = () => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  return useQuery<IServicesResponse>({
    queryKey: ["services", selectedCompanyId], // Добавляем companyId в ключ запроса
    queryFn: () => fetchServices(selectedCompanyId),
  });
};

export const useServiceDetailsQuery = (service_id: string) => {
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  return useQuery({
    queryKey: ["serviceDetails", service_id, selectedCompanyId],
    queryFn: () => fetchServiceDetails(service_id, selectedCompanyId),
    retry: false,
  });
};
