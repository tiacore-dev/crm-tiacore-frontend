//useservicequery
import { useQuery } from "@tanstack/react-query";
import {
  fetchServiceDetails,
  fetchServices,
  IService,
} from "../../api/servicesApi";

interface IServicesResponse {
  total: number;
  services: IService[];
}

export const useServiceQuery = () => {
  return useQuery<IServicesResponse>({
    queryKey: ["services"],
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
