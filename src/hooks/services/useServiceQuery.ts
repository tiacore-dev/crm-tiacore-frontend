//useservicequery
import { useQuery } from "@tanstack/react-query";
import {
  fetchServiceDetails,
  fetchServices,
  IService,
} from "../../api/servicesApi";
import { useCompany } from "../../context/companyContext";

interface IServicesResponse {
  total: number;
  services: IService[];
}

export const useServiceQuery = () => {
  const { selectedCompanyId } = useCompany();

  return useQuery<IServicesResponse>({
    queryKey: ["services", selectedCompanyId], // Добавляем companyId в ключ запроса
    queryFn: fetchServices, // Загружаем все данные один раз
  });
};

export const useServiceDetailsQuery = (service_id: string) => {
  return useQuery({
    queryKey: ["serviceDetails", service_id],
    queryFn: () => fetchServiceDetails(service_id),
    retry: false,
  });
};
